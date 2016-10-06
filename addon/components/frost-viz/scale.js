import Ember from 'ember'
import layout from '../../templates/components/frost-viz/scale'
import DOMBox from 'ciena-frost-viz/mixins/frost-viz-dom-box'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import DefaultFormatter from 'ciena-frost-viz/helpers/frost-viz/format/default'
import Rectangle from 'ciena-frost-viz/utils/frost-viz-rectangle'
import SVGAffineTransformable from 'ciena-frost-viz/mixins/frost-viz-svg-transform-provider'
import {PropTypes} from 'ember-prop-types'

const DEFAULT_LABEL_FORMAT = DefaultFormatter.create().compute()
const TOP_BOTTOM = Ember.A(['top', 'bottom'])
const LEFT_RIGHT = Ember.A(['left', 'right'])
const TOP_BOTTOM_LEFT_RIGHT = Ember.A([...TOP_BOTTOM, ...LEFT_RIGHT])

const Scale = Ember.Component.extend(SVGAffineTransformable, DOMBox, Area, {
  layout,
  classNames: ['frost-viz-scale'],
  classNameBindings: ['dynamicClassNames'],

  propTypes: {
    align: PropTypes.string,
    boxObserveElement: PropTypes.string,
    binding: PropTypes.EmberObject.isRequired,
    // labelFormat: PropTypes.func.isRequired,
    tagName: PropTypes.string,
    scope: PropTypes.EmberObject
  },

  getDefaultProps () {
    return {
      align: 'left',
      boxObserveElement: '.frost-viz-scale-rect',
      labelFormat: DEFAULT_LABEL_FORMAT,
      tagName: 'g',
      scope: {
        area: Rectangle.create({width: 100, height: 100}),
        parent: Rectangle.create({width: 100, height: 100})
      }
    }
  },

  transformArea: Ember.computed.oneWay('scope.area'),
  parentArea: Ember.computed.oneWay('scope.area.parent'),

  x: Ember.computed('align', 'box.width', 'transformArea.width', function () {
    return this.get('align') === 'right'
      ? this.getWithDefault('transformArea.left', 0)
      : 0
  }),

  y: Ember.computed('align', 'box.height', 'transformArea.height', function () {
    return this.get('align') === 'bottom'
      ? this.getWithDefault('transformArea.top', 0)
      : 0
  }),

  rectArea: Ember.computed('align',
  'transformArea.{x,y,width,height}',
  'box.{x,y,width,height}',
  function () {
    const align = this.get('align')
    const box = this.get('box')
    const transformArea = Rectangle.from(this.get('transformArea'))
    let rectArea = Rectangle.from(box)
    if (TOP_BOTTOM_LEFT_RIGHT.includes(align)) {
      rectArea = rectArea.moveTo(0, 0)
      if (align === 'right') {
        rectArea = rectArea.translate(transformArea.get('left') + transformArea.get('width'), 0)
      }
      if (align === 'bottom') {
        rectArea = rectArea.translate(0, transformArea.get('top') + transformArea.get('height'))
      }
    }
    return rectArea
  }),

  dimension: Ember.computed.alias('binding.dimension'),

  domain: Ember.computed.alias('dimension.domain'),

  linesArea: Ember.computed('align',
  'transformArea.{x,y,width,height}', 'parentArea.{x,y,width,height}', 'box.{x,y,width,height}',
  function () {
    const align = this.get('align')
    const parentArea = Rectangle.from(this.get('parentArea'))
    const transformArea = Rectangle.from(this.get('transformArea'))
    const box = Rectangle.from(this.get('box'))
    const result = Rectangle.from(transformArea)
    if (TOP_BOTTOM.includes(align)) {
      result.set('height', transformArea.get('height') + box.get('height'))
      result.set('top', (align === 'top' ? parentArea : transformArea).get('top'))
    } else {
      result.set('width', transformArea.get('width') + box.get('width'))
      result.set('left', (align === 'left' ? parentArea : transformArea).get('left'))
    }
    return result
  }),

  tickElements: Ember.computed('domain', 'domain.[]', 'align',
  'transformArea', 'transformArea.{x,y,width,height}',
  'parentArea', 'parentArea.{x,y,width,height}',
  'box', 'box.{x,y,width,height}',
  function () {
    const align = this.get('align')
    const dimension = this.get('dimension')
    const tickCount = this.getWithDefault('tickCount', 10)
    const tickData = dimension.ticks(tickCount)
    if (!tickData) {
      return []
    }
    const isAligned = TOP_BOTTOM_LEFT_RIGHT.includes(align)
    const isTopBottom = TOP_BOTTOM.includes(align)

    const parentArea = Rectangle.from(this.get('parentArea'))
    const box = Rectangle.from(this.get('box'))
    if (!(align && isAligned)) {
      return []
    }
    if (!(Ember.get(box, 'width') && Ember.get(box, 'height'))) {
      return []
    }

    const linesArea = this.get('linesArea')
    const coords = isTopBottom
      ? function (area, v) {
        const c = linesArea.get('left') + linesArea.get('width') * v
        return { x1: c, x2: c, y1: area.get('top'), y2: area.get('bottom') }
      }
      : function (area, v) {
        const c = linesArea.get('bottom') - linesArea.get('height') * v
        return { y1: c, y2: c, x1: area.get('left'), x2: area.get('right') }
      }

    const labelsArea = Rectangle.from(linesArea)
    if (isTopBottom) {
      labelsArea.set('height', box.get('height'))
      if (align === 'bottom') {
        labelsArea.set('top', parentArea.get('height') - box.get('height'))
      }
    } else {
      labelsArea.set('width', box.get('width'))
      if (align === 'right') {
        labelsArea.set('left', parentArea.get('width') - box.get('width'))
      }
    }

    const lineCoords = (v) => coords(linesArea, v)
    const labelCoords = function (v) {
      const lc = coords(labelsArea, v)
      return {x: lc.x1, y: 0.5 * (lc.y1 + lc.y2)}
    }

    const labelFormat = this.get('labelFormat')
    const ticks = tickData.map((v) => {
      const val = dimension.evaluateValue(v)
      return Object.create({
        line: lineCoords(val),
        label: { position: labelCoords(val), caption: labelFormat(v) }
      })
    })
    return ticks
  }),

  reportedPadding: null,

  pushPadding: Ember.observer('align', 'parentArea.width', 'parentArea.height', function () {
    const align = this.get('align')
    const updatePadding = this.get('scope.callbacks.updatePadding')
    if (!(align && updatePadding)) {
      return
    }
    const key = this.get('key') || align
    const reportedPadding = this.get('reportedPadding') || {}
    const padding = { top: 0, right: 0, bottom: 0, left: 0 }
    const paddingProperty = TOP_BOTTOM.includes(align) ? 'box.height' : 'box.width'
    Ember.set(padding, align, this.getWithDefault(paddingProperty, 0))
    if (padding.top === reportedPadding.top &&
        padding.bottom === reportedPadding.bottom &&
        padding.left === reportedPadding.left &&
        padding.right === reportedPadding.right) return
    this.set('reportedPadding', padding)
    updatePadding(key, padding)
  }),

  keyFromAlign: Ember.computed('align', function () {
    const align = this.get('align')
    return TOP_BOTTOM.includes(align) ? 'x'
         : LEFT_RIGHT.includes(align) ? 'y'
         : null
  }),

  dynamicClassNames: Ember.computed('key', 'keyFromAlign', function () {
    const key = this.get('key') || this.get('keyFromAlign')
    return key ? `frost-viz-scale-${key}` : ''
  })

})

Scale.reopenClass({
  positionalParams: ['scope', 'binding']
})

export default Scale

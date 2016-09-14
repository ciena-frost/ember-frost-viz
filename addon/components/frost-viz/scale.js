import Ember from 'ember';
import layout from '../../templates/components/frost-viz/scale';
import DOMBox from 'ember-frost-viz/mixins/frost-viz-dom-box'
import Area from 'ember-frost-viz/mixins/frost-viz-area'
import DefaultFormatter from 'ember-frost-viz/helpers/frost-viz/format/default'
import Rectangle from 'ember-frost-viz/utils/frost-viz-rectangle'
import SVGAffineTransformable from 'ember-frost-viz/mixins/frost-viz-svg-transform-provider'
import PropTypes from 'ember-prop-types'

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
    // dimension: PropTypes.object.isRequired,
    // labelFormat: PropTypes.func.isRequired,
    tagName: PropTypes.string,
    transformScope: PropTypes.object
  },

  getDefaultProps () {
    return {
      align: 'left',
      boxObserveElement: '.frost-viz-scale-rect',
      labelFormat: DEFAULT_LABEL_FORMAT,
      tagName: 'g',
      transformScope: {
        transformArea: Rectangle.create({width: 100, height: 100}),
        parent: Rectangle.create({width: 100, height: 100})
      }
    }
  },

  transformArea: Ember.computed.oneWay('transformScope.transformArea'),
  parentArea: Ember.computed.oneWay('transformArea.parent'),

  x: Ember.computed('align', 'box.width', 'parentArea.width', function () {
    return this.get('align') === 'right'
      ? this.getWithDefault('transformArea.left', 0)
      : 0
  }),

  y: Ember.computed('align', 'box.height', 'parentArea.height', function () {
    return this.get('align') === 'bottom'
      ? this.getWithDefault('transformArea.top', 0)
      : 0
  }),

  rectArea: Ember.computed('align', 'box', 'transformArea', function () {
    const align = this.get('align')
    const box = this.get('box')
    const transformArea = Rectangle.from(this.get('transformArea'))
    const rectArea = Rectangle.from(box).moveTo(0, 0)

    if (align === 'left' || align === 'top') {
      return rectArea
    }

    if (align === 'right') {
      return rectArea.translate(0, transformArea.get('width'))
    }

    if (align === 'bottom') {
      return rectArea.translate(0, transformArea.get('height'))
    }
  }),

  tickElements: Ember.computed('dimension', 'dimension.domain', 'dimension.domain.[]',
    'align', 'area', 'transformScope.transformArea', function () {
      const align = this.get('align')
      const dimension = this.get('dimension')
      const transformArea = Rectangle.from(this.get('transformScope.transformArea'))
      const parentArea = Rectangle.from(this.get('parentArea'))
      const box = Rectangle.from(this.get('box'))
      if (!(align && TOP_BOTTOM_LEFT_RIGHT.contains(align) && Ember.get(box, 'width') && Ember.get(box, 'height'))) {
        // console.log(`axis ${this.get('key')} has no aligned area so no ticks`)
        return []
      }

      // console.log('scale for', align)
      // console.log('scale transformArea', transformArea)
      // console.log('scale box', box)
      // console.log('scale parentArea', parentArea)

      const linesArea = Rectangle.from(transformArea)
      if (TOP_BOTTOM.contains(align)) {
        linesArea.set('height', transformArea.get('height') + box.get('height'))
        linesArea.set('top', (align === 'top' ? parentArea : transformArea).get('top'))
      } else {
        linesArea.set('width', transformArea.get('width') + box.get('width'))
        linesArea.set('left', (align === 'left' ? parentArea : transformArea).get('left'))
      }

    // console.log('scale linesArea', linesArea)

    // grid format
    // TODO: polar axes r, ϴ
      const coords = TOP_BOTTOM.contains(align)
      ? function (area, v) {
        const c = linesArea.get('left') + linesArea.get('width') * v
        return { x1: c, x2: c, y1: area.get('top'), y2: area.get('bottom') }
      }
      : function (area, v) {
        const c = linesArea.get('bottom') - linesArea.get('height') * v
        return { y1: c, y2: c, x1: area.get('left'), x2: area.get('right') }
      }

      const labelsArea = Rectangle.from(linesArea)
      if (TOP_BOTTOM.contains(align)) {
        labelsArea.set('height', box.get('height'))
        if (align === 'bottom') {
          labelsArea.set('top', parentArea.get('height') - box.get('height'))
        }
      } else {
        labelsArea.set('width', box.get('width'))
        if (align === 'right') {
          labelsArea.set('right', parentArea.get('width') - box.get('width'))
        }
      }

      // console.log('scale labelsArea', labelsArea)

      const lineCoords = (v) => coords(linesArea, v)
      const labelCoords = function (v) {
        const lc = coords(labelsArea, v)
        return {x: lc.x1, y: 0.5 * (lc.y1 + lc.y2)}
      }

      const tickCount = this.getWithDefault('tickCount', 10)
      const tickData = dimension.ticks(tickCount)
      const labelFormat = this.get('labelFormat')
    // console.log('creating ticks x', tickCount, tickData)
      const ticks = tickData.map((v) => {
        const val = dimension.evaluateValue(v)
        return Object.create({
          line: lineCoords(val),
          label: { position: labelCoords(val), caption: labelFormat(v) }
        })
      })
    // console.log(`axis ${this.get('key')} ticks`, ticks)
      return ticks
    }),

  reportedMargin: null,

  pushMargins: Ember.observer('align', 'parentArea.width', 'parentArea.height', function () {
    const align = this.get('align')
    const propagateMargin = this.get('transformScope.actions.updateMargins')
    if (!(align && propagateMargin)) return
    const key = this.get('key') || align
    const reportedMargin = this.get('reportedMargin') || {}
    const margin = { top: 0, right: 0, bottom: 0, left: 0 }
    const marginProperty = TOP_BOTTOM.contains(align) ? 'box.height' : 'box.width'
    Ember.set(margin, align, this.getWithDefault(marginProperty, 0))
    if (margin.top === reportedMargin.top &&
        margin.bottom === reportedMargin.bottom &&
        margin.left === reportedMargin.left &&
        margin.right === reportedMargin.right) return
    this.set('reportedMargin', margin)
    propagateMargin(key, margin)
  }),

  keyFromAlign: Ember.computed('align', function () {
    const align = this.get('align')
    return TOP_BOTTOM.contains(align) ? 'x'
         : LEFT_RIGHT.contains(align) ? 'y'
         : null
  }),

  dynamicClassNames: Ember.computed('key', 'keyFromAlign', function () {
    const key = this.get('key') || this.get('keyFromAlign')
    return key ? `frost-viz-scale-${key}` : ''
  })

})

Scale.reopenClass({
  positionalParams: ['transformScope']
})

export default Scale

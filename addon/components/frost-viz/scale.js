import Ember from 'ember'
import layout from '../../templates/components/frost-viz/scale'
import DOMBox from 'ciena-frost-viz/mixins/frost-viz-dom-box'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import DefaultFormatter from 'ciena-frost-viz/helpers/frost-viz/format/default'
import Rectangle from 'ciena-frost-viz/utils/frost-viz-rectangle'
import SVGAffineTransformable from 'ciena-frost-viz/mixins/frost-viz-svg-transform-provider'
import VizComputedProperties from 'ciena-frost-viz/utils/frost-viz-computed'
import { PropTypes } from 'ember-prop-types'
import { attributesEqual } from 'ciena-frost-viz/utils/frost-viz-object-operations'

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
    tickLabelFormat: PropTypes.func,
    tagName: PropTypes.string,
    scope: PropTypes.EmberObject.isRequired
  },

  getDefaultProps () {
    return {
      align: 'left',
      boxObserveElement: '.frost-viz-scale-rect',
      tickLabelFormat: DefaultFormatter.create().compute(),
      tagName: 'g'
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

  dimension: Ember.computed.alias('binding.dimension'),
  domain: Ember.computed.alias('dimension.domain'),

  getValid (property, validator, error) {
    const value = this.get(property)
    if (!validator(value)) {
      console.log('throwing', error, 'for', property, '=', value)
      throw new Error(error)
    }
    return value
  },

  validators: {
    area (rect) {
      return Ember.get(rect, 'area') >= 0
    },
    align (align) {
      return TOP_BOTTOM_LEFT_RIGHT.includes(align)
    }
  },

  boxRect: VizComputedProperties.rectangle('box'),
  parentAreaRect: VizComputedProperties.rectangle('parentArea'),
  transformAreaRect: VizComputedProperties.rectangle('transformArea'),

  tickData: Ember.computed('dimension', 'tickCount', function () {
    const dimension = this.get('dimension')
    const tickCount = this.getWithDefault('tickCount', 10)
    return dimension.ticks(tickCount)
  }),

  linesAreaRect: Ember.computed(
    'align',
    'boxRect',
    'parentAreaRect',
    'transformAreaRect',
  function () {
    const align = this.getValid('align', this.validators.align, 'align not recognized')
    const box = this.getValid('boxRect', this.validators.area, 'layout box has zero area')
    const parentArea = this.getValid('parentAreaRect', this.validators.area, 'parent has zero area')
    const transformArea = this.getValid('transformAreaRect', this.validators.area, 'parent transform has zero area')
    const isAlignVertical = this.get('isAlignVertical')
    const result = Rectangle.from(transformArea)
    if (isAlignVertical) {
      result.set('height', transformArea.get('height') + box.get('height'))
      result.set('top', (align === 'top' ? parentArea : transformArea).get('top'))
    } else {
      result.set('width', transformArea.get('width') + box.get('width'))
      result.set('left', (align === 'left' ? parentArea : transformArea).get('left'))
    }
    return result
  }),

  backgroundArea: Ember.computed(
    'align', 'transformAreaRect', 'box',
  function () {
    const align = this.get('align')
    const box = this.get('box')
    const transformArea = this.get('transformAreaRect')
    let backgroundArea = Rectangle.from(box)
    if (this.validators.align(align)) {
      backgroundArea = backgroundArea.moveTo(0, 0)
      if (align === 'right') {
        backgroundArea = backgroundArea.translate(transformArea.get('left') + transformArea.get('width'), 0)
      }
      if (align === 'bottom') {
        backgroundArea = backgroundArea.translate(0, transformArea.get('top') + transformArea.get('height'))
      }
    }
    return backgroundArea
  }),

  tickTextAnchor: Ember.computed('align', function () {
    const align = this.get('align')
    switch (align) {
      case 'left':
        return 'end'
      case 'top':
      case 'bottom':
        return 'middle'
    }
    return 'start'
  }),

  isAlignVertical: Ember.computed('align', function () {
    return TOP_BOTTOM.includes(this.get('align'))
  }),

  tickCoordsFunc: Ember.computed('isAlignVertical', function () {
    const isAlignVertical = this.get('isAlignVertical')
    return isAlignVertical
      ? this.get('tickCoordFuncVertical').bind(this)
      : this.get('tickCoordFuncHorizontal').bind(this)
  }),

  tickCoordFuncVertical (area, v) {
    const linesArea = this.get('linesAreaRect')
    const c = linesArea.get('left') + linesArea.get('width') * v
    return { x1: c, x2: c, y1: area.get('top'), y2: area.get('bottom') }
  },

  tickCoordFuncHorizontal (area, v) {
    const linesArea = this.get('linesAreaRect')
    const c = linesArea.get('bottom') - linesArea.get('height') * v
    return { y1: c, y2: c, x1: area.get('left'), x2: area.get('right') }
  },

  labelsAreaRect: Ember.computed(
    'boxRect', 'align', 'linesAreaRect', 'parentAreaRect', 'isAlignVertical',
  function () {
    const box = this.getValid('boxRect', this.validators.area, 'box has zero area')
    const align = this.getValid('align', this.validators.align, 'unrecognized align')
    const parentArea = this.get('parentAreaRect', this.validators.area, 'parent has zero area')
    const labelsArea = Rectangle.from(this.get('linesAreaRect'))
    const isAlignVertical = this.get('isAlignVertical')
    if (isAlignVertical) {
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
    return labelsArea
  }),

  tickElements: Ember.computed(
    'dimension', 'tickData', 'tickCoordsFunc', 'linesAreaRect', 'labelsAreaRect',
    'domain', 'domain.[]',
  function () {
    try {
      const dimension = this.getValid('dimension', k => !!k, 'dimension not set')
      const tickData = this.getValid('tickData', k => k && k.length, 'tick function returned no ticks')
      const coords = this.get('tickCoordsFunc')
      const linesArea = this.get('linesAreaRect')
      const labelsArea = this.get('labelsAreaRect')

      const lineCoords = (v) => coords(linesArea, v)
      const labelCoords = function (v, align) {
        const lc = coords(labelsArea, v)
        const x = align === 'end' ? lc.x2 : lc.x1
        return {x, y: 0.5 * (lc.y1 + lc.y2)}
      }

      const tickLabelFormat = this.get('tickLabelFormat')
      const textAnchor = this.get('tickTextAnchor')
      const ticks = tickData.map((v) => {
        const val = dimension.evaluateValue(v)
        return Object.create({
          line: lineCoords(val),
          label: { textAnchor, position: labelCoords(val, textAnchor), caption: tickLabelFormat(v) }
        })
      })
      return ticks
    } catch (error) {
      console.log('Not rendering elements', error)
      return []
    }
  }),

  reportedPadding: null,

  pushPadding: Ember.observer('align', 'parentArea.width', 'parentArea.height', function () {
    const align = this.get('align')
    const updatePadding = this.get('scope.callbacks.updatePadding')
    if (!(align && updatePadding)) {
      return
    }
    const reportedPadding = this.get('reportedPadding') || Ember.Object.create()
    const padding = { top: 0, right: 0, bottom: 0, left: 0 }
    const paddingProperty = TOP_BOTTOM.includes(align) ? 'box.height' : 'box.width'
    Ember.set(padding, align, this.getWithDefault(paddingProperty, 0))
    if (!attributesEqual(padding, reportedPadding, TOP_BOTTOM_LEFT_RIGHT)) {
      updatePadding(align, padding)
    }
  }),

  scaleKey: Ember.computed('align', 'key', function () {
    const key = this.get('key')
    if (key) {
      return key
    }
    const align = this.get('align')
    return TOP_BOTTOM.includes(align) ? 'x'
         : LEFT_RIGHT.includes(align) ? 'y'
         : null
  }),

  dynamicClassNames: Ember.computed('scaleKey', function () {
    const key = this.get('scaleKey')
    return key ? `frost-viz-scale-${key}` : ''
  })

})

Scale.reopenClass({
  positionalParams: ['scope', 'binding']
})

export default Scale

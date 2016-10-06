import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/plot/bar'
import ElementBuilder from 'ciena-frost-viz/mixins/frost-viz-element-builder'
import Rectangle from 'ciena-frost-viz/utils/frost-viz-rectangle'

const VERTICAL_ALIGN = Ember.A(['top', 'bottom'])
const DEFAULT_BAR_SPACING = 0.33

const clamp = function (val, min, max) {
  return Math.min(max, Math.max(val, min))
}

const Bar = Ember.Component.extend(ElementBuilder, {
  layout,
  classNames: ['frost-viz-plot-bar'],

  plotBars: undefined,

  align: 'bottom',

  barFunctions: Ember.Object.create({
    x (area, zero, width) {
      const clampZero = clamp(zero, area.get('left'), area.get('right'))
      const halfWidth = width / 2
      return function (el) {
        const x1 = el.x
        const x2 = clampZero
        return {x: Math.min(x1, x2), y: el.y - halfWidth, width: Math.abs(x1 - x2), height: width}
      }
    },
    y (area, zero, width) {
      const clampZero = clamp(zero, area.get('top'), area.get('bottom'))
      const halfWidth = width / 2
      return function (el) {
        const y1 = el.y
        const y2 = clampZero
        return {x: el.x - halfWidth, y: Math.min(y1, y2), width, height: Math.abs(y1 - y2)}
      }
    }
  }),

  alignDirection: Ember.computed('align', function () {
    const align = this.get('align')
    return VERTICAL_ALIGN.includes(align) ? 'y' : 'x'
  }),

  alignSpan: Ember.computed('align', function () {
    const align = this.get('aling')
    return VERTICAL_ALIGN.includes(align) ? 'height' : 'width'
  }),

  zero: Ember.computed('alignDirection', 'selectedBindings', 'transformsForArea', function () {
    const alignDirection = this.get('alignDirection')
    const selectedBindings = this.get('selectedBindings') || null
    if (!selectedBindings) return 0
    const transformsForArea = this.get('transformsForArea')
    const binding = selectedBindings.get(alignDirection)
    const dimension = binding.get('dimension')
    const transform = transformsForArea.get(alignDirection)
    const normalize = this.buildNormalizer(dimension)
    return transform(normalize(dimension.evaluateValue(0)))
  }),

  barWidth: Ember.computed('area', 'data.length', 'alignSpan', function () {
    const alignSpan = this.get('alignSpan')
    const area = this.get('area')
    const data = this.get('data')
    const span = Ember.get(area, alignSpan) || 100
    const barSpan = span * (1.0 - DEFAULT_BAR_SPACING)
    const elements = Ember.get(data, 'length') || 1
    return barSpan / elements
  }),

  bars: Ember.computed('data', 'elements', 'alignDirection', 'scope.area', 'barFunctions', 'zero', 'barWidth',
  'elementGenerate', function () {
    const data = this.get('data')
    const elements = this.get('elements')
    const alignDirection = this.get('alignDirection')
    const transformArea = Rectangle.from(this.get('scope.area'))
    const barFunctions = this.get('barFunctions')
    const zero = this.get('zero')
    const width = this.get('barWidth')
    const barFunction = barFunctions.get(alignDirection)(transformArea, zero, width)
    const elementGenerate = this.get('elementGenerate')
    return elements.map((el) => elementGenerate(el, data, barFunction(el)))
  })
})

Bar.reopenClass({
  positionalParams: ['scope']
})

export default Bar

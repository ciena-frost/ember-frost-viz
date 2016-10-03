import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/plot/bar'
import ElementBuilder from 'ciena-frost-viz/mixins/frost-viz-element-builder'
import Rectangle from 'ciena-frost-viz/utils/frost-viz-rectangle'

const VERTICAL_ALIGN = Ember.A(['top', 'bottom'])

const clamp = function (val, min, max) {
  return Math.min(max, Math.max(val, min))
}

const Bar = Ember.Component.extend(ElementBuilder, {
  layout,
  classNames: ['frost-viz-plot-bar'],

  plotBars: undefined,

  align: 'bottom',

  mapFunctions: Ember.Object.create({
    x (area, zero) {
      const clampZero = clamp(zero, area.get('left'), area.get('right'))
      return function (el) {
        const x1 = el.x
        const x2 = clampZero
        return {x: Math.min(x1, x2), y: el.y - 10, width: Math.abs(x1 - x2), height: 20}
      }
    },
    y (area, zero) {
      const clampZero = clamp(zero, area.get('top'), area.get('bottom'))
      return function (el) {
        const y1 = el.y
        const y2 = clampZero
        console.log('bar')
        return {x: el.x - 10, y: Math.min(y1, y2), width: 20, height: Math.abs(y1 - y2)}
      }
    }
  }),

  alignDirection: Ember.computed('align', function () {
    const align = this.get('align')
    return VERTICAL_ALIGN.contains(align) ? 'y' : 'x'
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

  bars: Ember.computed('elements', 'alignDirection', 'selectedBindings', 'coordinateTransforms', function () {
    const transformArea = Rectangle.from(this.get('scope.area'))
    const alignDirection = this.get('alignDirection')
    const mapFunctions = this.get('mapFunctions')
    const zero = this.get('zero')
    const alignFunction = mapFunctions.get(alignDirection)(transformArea, zero)
    const elements = this.get('elements')
    const elementOverride = this.get('elementOverride')
    return elements.map((el) => elementOverride(el, alignFunction(el)))
  })
})

Bar.reopenClass({
  positionalParams: ['scope']
})

export default Bar

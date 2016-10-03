import Ember from 'ember'
import SVGAffineTransform from 'ciena-frost-viz/mixins/frost-viz-svg-transform-provider'
import SVGClipPathProvider from 'ciena-frost-viz/mixins/frost-viz-svg-clip-path-provider'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import {mapObj} from 'ciena-frost-viz/utils/frost-viz-data-transform'

const NULL_BINDING = {evaluateElement: () => 0, dimension: {domain: [0, 1], range: [0, 1], evaluateValue: () => 0}}
const NULL_TRANSFORM = (value) => value

export default Ember.Mixin.create(Area, SVGAffineTransform, SVGClipPathProvider, {
  tagName: 'g',
  classNames: ['frost-viz-plot'],
  area: Ember.computed.alias('scope.area'),
  x: Ember.computed.alias('area.x'),
  y: Ember.computed.alias('area.y'),

  width: Ember.computed.alias('area.width'),
  height: Ember.computed.alias('area.height'),
  data: Ember.computed.alias('scope.data'),
  coordinateTransforms: Ember.computed.alias('scope.coordinateTransforms'),

  dataBindings: null,

  selectedBindings: Ember.computed('dataBindings', 'scope.dataBindings', function () {
    const explicitBindings = this.get('dataBindings')
    const scopeBindings = this.get('scope.dataBindings')
    const result = Ember.Object.create(scopeBindings, explicitBindings)
    return result
  }),

  dimensions: Ember.computed('selectedBindings', function () {
    const selectedBindings = this.get('selectedBindings')
    return mapObj(selectedBindings, (key, val) => {
      Ember.assert(`Parent scope defines multiple dataBindings for key ${key}, must specify a single binding`,
        !Array.isArray(val))
      return val.get('dimension')
    })
  }),

  renderReady: false,

  didRender () {
    Ember.run.scheduleOnce('afterRender', () => {
      this.set('renderReady', true)
    })
  },

  buildNormalizer (dimension) {
    const range = Ember.get(dimension, 'range')
    return (v) => (v - range[0]) / (range[1] - range[0])
  },

  transformsForArea: Ember.computed('coordinateTransforms', 'area', function () {
    const area = this.get('area')
    const transforms = this.get('coordinateTransforms')
    return Ember.Object.create(transforms(area))
  }),

  dimensionOverrides: Ember.computed('selectedBindings', 'transformsForArea', function () {
    const selectedBindings = this.get('selectedBindings') || {}
    const transformsForArea = this.get('transformsForArea')
    const keys = Object.keys(transformsForArea)
    const normalizedDimensions = {}
    for (let key of keys) {
      const binding = Ember.get(selectedBindings, key) || NULL_BINDING
      const dimension = Ember.get(binding, 'dimension')
      const transform = Ember.get(transformsForArea, key) || NULL_TRANSFORM
      const normalize = this.buildNormalizer(dimension)
      normalizedDimensions[key] = (element) => transform(normalize(dimension.evaluateElement(element, binding)))
    }
    return normalizedDimensions
  }),

  elementOverride (el, ...overrideArray) {
    const overridden = Ember.get(el, 'overridden') || Ember.Object.create()
    let didOverride = false
    for (let overrides of overrideArray) {
      const keys = Object.keys(overrides)
      for (let key of keys) {
        if (el.hasOwnProperty(key)) {
          Ember.set(overridden, key, Ember.get(el, key))
          didOverride = true
        }
        Ember.set(el, key, Ember.get(overrides, key))
      }
    }
    if (didOverride) {
      Ember.set(el, 'overridden', overridden)
    }
    return el
  },

  elementBuilder: Ember.computed('scope.actions', 'dimensions', 'dimensionOverrides', function () {
    const callbacks = this.get('scope.callbacks')
    const dimensions = Object.assign({}, this.get('dimensions'), this.get('dimensionOverrides'))
    const dimensionKeys = Object.keys(dimensions)
    const elementOverride = this.get('elementOverride')
    return function (element) {
      const transformed = {}
      for (const dimensionKey of dimensionKeys) {
        transformed[dimensionKey] = dimensions[dimensionKey](element)
      }
      return elementOverride(element, { callbacks }, transformed)
    }
  }),

  elements: Ember.computed('data', 'data.[]', 'elementBuilder', 'renderReady', function () {
    const elementBuilder = this.get('elementBuilder')
    const data = this.get('data') || Ember.A([])
    const result = data.map(elementBuilder)
    return result
  })
})

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
    const result = Object.assign({}, scopeBindings, explicitBindings)
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

  dimensionOverrides: Ember.computed('area', 'selectedBindings', 'coordinateTransforms', function () {
    const buildNormalizer = function (dimension) {
      const range = Ember.get(dimension, 'range')
      return (v) => (v - range[0]) / (range[1] - range[0])
    }

    const area = this.get('area')
    const selectedBindings = this.get('selectedBindings') || {}
    const transforms = this.get('coordinateTransforms')(area)
    const keys = Object.keys(transforms)
    const normalizedDimensions = {}
    for (let key of keys) {
      const binding = Ember.get(selectedBindings, key) || NULL_BINDING
      const dimension = Ember.get(binding, 'dimension')
      const transform = Ember.get(transforms, key) || NULL_TRANSFORM
      const normalize = buildNormalizer(dimension)
      normalizedDimensions[key] = (element) => transform(normalize(dimension.evaluateElement(element, binding)))
    }
    return normalizedDimensions
  }),

  elementBuilder: Ember.computed('scope.actions', 'dimensions', 'dimensionOverrides', function () {
    const callbacks = this.get('scope.callbacks')
    const dimensions = Object.assign({}, this.get('dimensions'), this.get('dimensionOverrides'))
    const dimensionKeys = Object.keys(dimensions)
    return function (element) {
      const transformed = {}
      const overridden = {}
      for (const dimensionKey of dimensionKeys) {
        transformed[dimensionKey] = dimensions[dimensionKey](element)
        if (element.hasOwnProperty(dimensionKey)) {
          overridden[dimensionKey] = element[dimensionKey]
        }
      }
      const result = Object.assign({ callbacks }, element, { overridden }, transformed)
      return result
    }
  }),

  elements: Ember.computed('data', 'data.[]', 'elementBuilder', 'renderReady', function () {
    const elementBuilder = this.get('elementBuilder')
    const data = this.get('data') || Ember.A([])
    const result = data.map(elementBuilder)
    return result
  })
})

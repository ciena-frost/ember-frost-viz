import Ember from 'ember'
import SVGAffineTransform from 'ciena-frost-viz/mixins/frost-viz-svg-transform-provider'
import SVGClipPathProvider from 'ciena-frost-viz/mixins/frost-viz-svg-clip-path-provider'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'

const NULL_DIMENSION = {domain: [0, 1], range: [0, 1], evaluateElement: () => 0}
const NULL_TRANSFORM = (value) => value
const DEFAULT_AREA = {width: 100, height: 100}

export default Ember.Mixin.create(Area, SVGAffineTransform, SVGClipPathProvider, {
  tagName: 'g',
  classNames: ['frost-viz-plot'],
  area: Ember.computed.alias('scope.area'),
  x: Ember.computed.alias('area.x'),
  y: Ember.computed.alias('area.y'),

  width: Ember.computed.alias('area.width'),
  height: Ember.computed.alias('area.height'),
  data: Ember.computed.alias('scope.data'),
  dimensions: Ember.computed.alias('scope.dimensions'),

  renderReady: false,

  didRender () {
    Ember.run.scheduleOnce('afterRender', () => {
      this.set('renderReady', true)
    })
  },

  /**
   * Default transforms for cartesian (y-up).
   */
  coordinateTransforms: Ember.computed('area', function () {
    const area = this.get('area') || DEFAULT_AREA
    return {
      x: (value) => area.width * value,
      y: (value) => area.height * (1.0 - value)
    }
  }),

  dimensionOverrides: Ember.computed('dimensions', 'coordinateTransforms', function () {
    const buildNormalizer = function (dimension) {
      const range = Ember.get(dimension, 'range')
      return (v) => (v - range[0]) / (range[1] - range[0])
    }

    const dimensions = this.get('dimensions') || {}
    const transforms = this.get('coordinateTransforms')
    const keys = Object.keys(transforms)
    const normalizedDimensions = {}
    for (let key of keys) {
      const dimension = Ember.get(dimensions, key) || NULL_DIMENSION
      console.log('dimension', dimension)
      const transform = Ember.get(transforms, key) || NULL_TRANSFORM
      const normalize = buildNormalizer(dimension)
      normalizedDimensions[key] = (element) => transform(normalize(dimension.evaluateElement(element)))
    }
    // console.log('normalizedDimensions', normalizedDimensions)
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
      // console.log('element', result)
      return result
    }
  }),

  elements: Ember.computed('data', 'data.[]', 'elementBuilder', 'renderReady', function () {
    const elementBuilder = this.get('elementBuilder')
    const data = this.get('data') || Ember.A([])
    const result = data.map(elementBuilder)
    // console.log('elements updated', data.length /*, data, result */)
    return result
  })
})

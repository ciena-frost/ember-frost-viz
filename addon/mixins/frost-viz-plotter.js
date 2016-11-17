import Ember from 'ember'
import SVGAffineTransform from 'ciena-frost-viz/mixins/frost-viz-svg-transform-provider'
import SVGClipPathProvider from 'ciena-frost-viz/mixins/frost-viz-svg-clip-path-provider'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import {mapObj} from 'ciena-frost-viz/utils/frost-viz-data-transform'
import {PropTypes} from 'ember-prop-types'

const NULL_BINDING = {evaluateElement: () => 0, dimension: {domain: [0, 1], range: [0, 1], evaluateValue: () => 0}}
const NULL_TRANSFORM = (value) => value

export default Ember.Mixin.create(Area, SVGAffineTransform, SVGClipPathProvider, {
  tagName: 'g',
  classNames: ['frost-viz-plot'],
  classNameBindings: ['dynamicClassNames'],

  propTypes: {
    // area: PropTypes.EmberObject, // TODO: Rectangle
    width: PropTypes.number,
    height: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
    // dataBindings: PropTypes.oneOf([ // TODO: warns every refresh
    //   PropTypes.object,
    //   PropTypes.EmberObject
    // ]),
    // selectedBindings: PropTypes.oneOf([ // TODO: warns every refresh
    //   PropTypes.object,
    //   PropTypes.EmberObject
    // ]),
    // coordinateTransforms: PropTypes.oneOf([ // TODO: warns anyway
    //   PropTypes.object,
    //   PropTypes.EmberObject
    // ])
    // scope: PropTypes.oneOf([ // TODO: positional, present, warns anyway
    //   PropTypes.object,
    //   PropTypes.EmberObject
    // ]).isRequired
  },

  getDefaultProps () {
    return {
      allowSparseElements: false,
      dataBindings: null
    }
  },

  data: Ember.computed.alias('scope.data'),

  area: Ember.computed.alias('scope.area'),
  x: Ember.computed.alias('area.x'),
  y: Ember.computed.alias('area.y'),
  width: Ember.computed.alias('area.width'),
  height: Ember.computed.alias('area.height'),

  coordinateTransforms: Ember.computed.alias('scope.coordinateTransforms'),

  selectedBindings: Ember.computed('dataBindings', 'scope.dataBindings', function () {
    const explicitBindings = this.get('dataBindings')
    const scopeBindings = this.get('scope.dataBindings')
    const result = Ember.Object.create(scopeBindings, explicitBindings)
    return result
  }),

  dynamicClassNames: Ember.computed('selectedBindings', function () {
    const selectedBindings = this.get('selectedBindings')
    const keys = Object.keys(selectedBindings)
    const names = Ember.A([])
    for (let key of keys) {
      const binding = selectedBindings.get(key)
      const property = binding.get('property')
      if (!property) continue
      const dasherized = Ember.String.dasherize(property)
      names.pushObject(`frost-viz-plot-${dasherized}`)
    }
    return names.join(' ')
  }),

  dimensions: Ember.computed('selectedBindings', function () {
    const selectedBindings = this.get('selectedBindings')
    return mapObj(selectedBindings, (key, val) => {
      Ember.assert(
        'element builder: calculating dimensions: Parent scope defines multiple dataBindings for key ' +
        key + ' must override with a single binding',
        !Array.isArray(val))
      return val.get('dimension')
    })
  }),

  renderReady: false,

  didRender () {
    // There is usually no point in creating elements on first render, because the
    // root Chart component usually has to render once in order to capture its dimensions
    // from CSS. This means that the first render is usually in an area of (0x0).
    // TODO: maybe check whether area is greater than 0x0 and set renderReady to true
    // immediately if so.
    Ember.run.scheduleOnce('afterRender', () => {
      this.set('renderReady', true)
    })
  },

  buildNormalizer (dimension) {
    const range = Ember.get(dimension, 'range')
    return (v) => (v - range[0]) / (range[1] - range[0])
  },

  transformsForArea: Ember.computed('coordinateTransforms', 'innerArea', function () {
    const innerArea = this.get('innerArea')
    const transforms = this.get('coordinateTransforms')
    return Ember.Object.create(transforms(innerArea))
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
      normalizedDimensions[key] = (element) => {
        const value = dimension.evaluateElement(element, binding)
        return (value === undefined) ? undefined : transform(normalize(value))
      }
    }
    return normalizedDimensions
  }),

  elementGenerate (el, data, ...attributeArray) {
    const result = Ember.Object.create()
    for (let attributeObj of attributeArray) {
      result.setProperties(attributeObj)
    }
    result.set('element', el)
    return result
  },

  elementBuilder: Ember.computed('data', 'scope.actions', 'dimensions', 'dimensionOverrides', function () {
    const callbacks = this.get('scope.callbacks')
    const dimensions = Object.assign({}, this.get('dimensions'), this.get('dimensionOverrides'))
    const dimensionKeys = Object.keys(dimensions)
    const elementGenerate = this.get('elementGenerate')
    const data = this.get('data')
    const allowSparseElements = this.get('allowSparseElements')
    return function (element) {
      const transformed = {}
      let anyValue = false
      let sparse = false
      for (const dimensionKey of dimensionKeys) {
        const dimValue = dimensions[dimensionKey](element)
        const isUndefined = (dimValue === undefined)
        transformed[dimensionKey] = dimValue
        anyValue = anyValue || (!isUndefined)
        sparse = sparse || (isUndefined)
      }
      const allow = (allowSparseElements && anyValue) || (!sparse)
      // console.log('allow', allow, transformed)
      return allow ? elementGenerate(element, data, { callbacks }, transformed) : undefined
    }
  }),

  elements: Ember.computed('data', 'data.[]', 'elementBuilder', 'renderReady', function () {
    const elementBuilder = this.get('elementBuilder')
    const data = this.get('data') || Ember.A([])
    const result = data.map(elementBuilder).filter(e => e !== undefined)
    return result
  })
})

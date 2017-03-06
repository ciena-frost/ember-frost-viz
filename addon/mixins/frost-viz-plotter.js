import Ember from 'ember'
const {A, Mixin, assert, computed, get, run} = Ember
const {dasherize} = Ember.String
import Area from 'ember-frost-viz/mixins/frost-viz-area'
import SVGClipPathProvider from 'ember-frost-viz/mixins/frost-viz-svg-clip-path-provider'
import SVGAffineTransform from 'ember-frost-viz/mixins/frost-viz-svg-transform-provider'
import {mapObj} from 'ember-frost-viz/utils/frost-viz-data-transform'
import {PropTypes} from 'ember-prop-types'

const NULL_BINDING = {evaluateElement: () => 0, dimension: {domain: [0, 1], range: [0, 1], evaluateValue: () => 0}}
const NULL_TRANSFORM = (value) => value

export default Mixin.create(Area, SVGAffineTransform, SVGClipPathProvider, {
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

  data: computed.alias('scope.data'),

  area: computed.alias('scope.area'),
  x: computed.alias('area.x'),
  y: computed.alias('area.y'),
  width: computed.alias('area.width'),
  height: computed.alias('area.height'),

  coordinateTransforms: computed.alias('scope.coordinateTransforms'),

  selectedBindings: computed('dataBindings', 'scope.dataBindings', function () {
    const explicitBindings = this.get('dataBindings')
    const scopeBindings = this.get('scope.dataBindings')
    const result = Ember.Object.create(scopeBindings, explicitBindings)
    return result
  }),

  dynamicClassNames: computed('selectedBindings', function () {
    const selectedBindings = this.get('selectedBindings')
    const keys = Object.keys(selectedBindings)
    const names = A([])
    for (let key of keys) {
      const binding = selectedBindings.get(key)
      const property = binding.get('property')
      if (!property) continue
      const dasherized = dasherize(property)
      names.pushObject(`frost-viz-plot-${dasherized}`)
    }
    return names.join(' ')
  }),

  dimensions: computed('selectedBindings', function () {
    const selectedBindings = this.get('selectedBindings')
    return mapObj(selectedBindings, (key, val) => {
      assert(
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
    run.scheduleOnce('afterRender', () => {
      this.set('renderReady', true)
    })
  },

  buildNormalizer (dimension) {
    const range = get(dimension, 'range')
    return (v) => (v - range[0]) / (range[1] - range[0])
  },

  transformsForArea: computed('coordinateTransforms', 'innerArea', function () {
    const innerArea = this.get('innerArea')
    const transforms = this.get('coordinateTransforms')
    return Ember.Object.create(transforms(innerArea))
  }),

  dimensionOverrides: computed('selectedBindings', 'transformsForArea', function () {
    const selectedBindings = this.get('selectedBindings') || {}
    const transformsForArea = this.get('transformsForArea')
    const keys = Object.keys(transformsForArea)
    const normalizedDimensions = {}
    for (let key of keys) {
      const binding = get(selectedBindings, key) || NULL_BINDING
      const dimension = get(binding, 'dimension')
      const transform = get(transformsForArea, key) || NULL_TRANSFORM
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

  /* eslint-disable complexity */
  elementBuilder: computed('data', 'scope.actions', 'dimensions', 'dimensionOverrides', function () {
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
      return allow ? elementGenerate(element, data, {callbacks}, transformed) : undefined
    }
  }),
  /* eslint-enable complexity */

  elements: computed('data', 'data.[]', 'elementBuilder', 'renderReady', function () {
    const elementBuilder = this.get('elementBuilder')
    const data = this.get('data') || A([])
    const result = data.map(elementBuilder).filter(e => e !== undefined)
    return result
  })
})

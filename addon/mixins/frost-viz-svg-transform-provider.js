import Ember from 'ember'
const {A, Mixin, computed, observer} = Ember
import SetOperations from 'ember-frost-viz/utils/frost-viz-set-operations'

// Wanted to be SVGTransforable but this is a name reserved by SVG 1.1.
/**
 * This mixin assembles all transformAttributes on the component into a transform string,
 * e.g. transform="translate(10 20) rotate(10)"
 *
 * To do this, it watches transformAttributes, and maintains a set of property observers for all elements in the list.
 * @type {[type]}
 */
const SVGTransformed = Mixin.create({
  concatenatedProperties: ['transformAttributes'],
  attributeBindings: ['transform'],

  init () {
    this._super(...arguments)
    this.updateTransformObservers()
  },

  transform: computed('transformAttributes.[]', function () {
    const props = this.get('transformAttributes') || A([])
    const self = this
    return props.map(function (key) {
      const value = self.get(key)
      return (value === null || value === undefined) ? '' : `${key}(${value})`
    }).join(' ')
  }),

  transformDidChange () {
    this.notifyPropertyChange('transform')
  },

  updateTransformObservers () {
    const previouslyObserved = this.get('_lastObservedAttributes') || A([])
    const currentlyObserved = this.get('transformAttributes')
    const addedAttributes = SetOperations.difference(currentlyObserved, previouslyObserved)
    const removedAttributes = SetOperations.difference(previouslyObserved, currentlyObserved)
    const self = this;
    [...addedAttributes].forEach(function (attr) {
      self.addObserver(attr, self, self.transformDidChange)
    });
    [...removedAttributes].forEach(function (attr) {
      self.removeObserver(attr, self, self.transformDidChange)
    })
  },
  observeTransformAttributes: observer('transformAttributes', function () {
    this.updateTransformObservers()
  })
})

const SVGPositionable = Mixin.create(SVGTransformed, {
  tagName: 'g',
  transformAttributes: ['translate'],
  transformDependentAttributes: ['x', 'y'],
  translate: computed('x', 'y', function () {
    const x = this.get('x')
    const y = this.get('y')
    return x || y ? `${x || 0} ${y || 0}` : null
  })
})

const SVGRotatable = Mixin.create(SVGTransformed, {
  transformAttributes: ['rotate']
})

const SVGAffineTransformable = Mixin.create(SVGPositionable, SVGRotatable)

export default SVGAffineTransformable
export {
  SVGTransformed,
  SVGPositionable,
  SVGRotatable,
  SVGAffineTransformable
}

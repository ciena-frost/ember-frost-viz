import Ember from 'ember'
const {A, Mixin, computed, observer} = Ember

// import PropTypeMixin, { PropTypes } from 'ember-prop-types'
// TODO: convert to PropTypes when mixin support PR merges:
// https://github.com/ciena-blueplanet/ember-prop-types/pull/64

/**
 * This mixin, to be used in a component, watches for changes to data and updates dimensions without fixed, predefined
 * domains.
 */
export default Mixin.create({

  init () {
    this._super(...arguments)
    this.set('_dataBindings', A([]))
    this.get('dynamicDimensions') // observe me
  },

  callbacks: {
    addDataBinding (binding) {
      const dimension = binding.get('dimension')
      dimension.get('dataBindings').addObject(binding)
      this.get('_dataBindings').addObject(binding)
    }
  },

  // All dimensions depend on a childScope and all bindings depend on a dimension.
  // Release all known bindings when childScope changes.
  releaseBindings: observer('childScope', function () {
    this.get('_dataBindings').clear()
  }),

  dynamicDimensions: computed('_dataBindings', '_dataBindings.[]', function () {
    const bindings = this.get('_dataBindings')
    const dimensions = A([])
    bindings.map((b) => dimensions.addObject(b.get('dimension')))
    return dimensions.filter((d) => d.computeDomain)
  }),

  recomputeDomains: observer('data.[]', 'dynamicDimensions', 'dynamicDimensions.[]', function () {
    const dynamicDimensions = this.get('dynamicDimensions')
    for (let dim of dynamicDimensions) {
      dim.computeDomain()
    }
  })

})

import Ember from 'ember'

// import PropTypeMixin, { PropTypes } from 'ember-prop-types'
// TODO: convert to PropTypes when mixin support PR merges:
// https://github.com/ciena-blueplanet/ember-prop-types/pull/64

/**
 * This mixin, to be used in a component, watches for changes to data and updates dimensions without fixed, predefined
 * domains.
 */
export default Ember.Mixin.create({

  init () {
    this._super(...arguments)
    this.set('_dataBindings', Ember.A([]))
    this.get('dynamicDimensions') // observe me
  },

  callbacks: {
    addDataBinding (binding) {
      // console.log('adding binding', binding)
      const dimension = binding.get('dimension')
      dimension.get('dataBindings').addObject(binding)
      this.get('_dataBindings').addObject(binding)
      // console.log('binding summary for', binding.property, binding)
    }
  },

  // All dimensions depend on a childScope and all bindings depend on a dimension.
  // Release all known bindings when childScope changes.
  releaseBindings: Ember.observer('childScope', function () {
    this.get('_dataBindings').clear()
  }),

  dynamicDimensions: Ember.computed('_dataBindings', '_dataBindings.[]', function () {
    // console.log('recalculating dynamic dimensions')
    const bindings = this.get('_dataBindings')
    const dimensions = Ember.A([])
    bindings.map((b) => dimensions.addObject(b.get('dimension')))
    return dimensions.filter((d) => d.computeDomain)
  }),

  recomputeDomains: Ember.observer('data.[]', 'dynamicDimensions', 'dynamicDimensions.[]', function () {
    // console.log('recomputing domains')
    const data = this.get('data')
    const dynamicDimensions = this.get('dynamicDimensions')
    // console.log('computing domains for dynamic dimensions', dynamicDimensions)
    for (let dim of dynamicDimensions) {
      dim.computeDomain(data)
    }
  })

})

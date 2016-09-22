import Ember from 'ember'

// import PropTypeMixin, { PropTypes } from 'ember-prop-types'
// TODO: convert to PropTypes when mixin support PR merges:
// https://github.com/ciena-blueplanet/ember-prop-types/pull/64

/**
 * This mixin, to be used in a component, watches for changes to data and updates dimensions without fixed, predefined
 * domains.
 *
 */
export default Ember.Mixin.create({

  init () {
    this._super(...arguments)
    this.set('_dimensions', Ember.A([]))
    this.set('_dynamicDomainDimensions', Ember.A([]))
  },

  callbacks: {
    addDimension (dimension) {
      this.get('_dimensions').addObject(dimension)
    }
  },

  updateDynamicDimensions: Ember.observer('_dimensions.[]', function () {
    // console.log('updating dynamic dimensions');
    const _dimensions = this.get('_dimensions')
    const _dynamicDomainDimensions = this.get('_dynamicDomainDimensions')
    for (let dim of _dimensions) {
      if (!dim.domain) {
        _dynamicDomainDimensions.addObject(dim)
      }
    }
    // console.log('dynamic _dimensions', _dynamicDomainDimensions.length);
  }),

  recomputeDomains: Ember.observer('data.[]', '_dynamicDomainDimensions.[]', function () {
    const _dynamicDomainDimensions = this.get('_dynamicDomainDimensions')
    const data = this.get('data')
    // console.log('computing dynamic _dimensions', _dynamicDomainDimensions)
    for (let dim of _dynamicDomainDimensions) {
      dim.computeDomain(data)
    }
  })

})

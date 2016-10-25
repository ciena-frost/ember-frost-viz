import Ember from 'ember'

const fUndef = () => undefined

const DataBinding = Ember.Object.extend({
  dimension: null,
  property: null,
  selector: fUndef
})

export default Ember.Mixin.create({
  createSelector (selectorProperty) {
    if (typeof selectorProperty === 'function') {
      return selectorProperty
    }
    if (typeof selectorProperty === 'string') {
      return (v) => Ember.get(v, selectorProperty)
    }
    return (v) => v
  },

  compute (params, hash) {
    const dimension = params.shift()
    Ember.assert('binding: dimension object not passed or not valid', Ember.typeOf(dimension) === 'instance')
    const selectorIn = params.shift()
    const data = params.shift() || hash.data || dimension.get('scope.data')
    Ember.assert('binding: data not specified or inherited, or was not array', Array.isArray(data))
    const binding = this.dataBindingBuilder(dimension, data, selectorIn, hash)
    const scope = dimension.scope
    if (scope && scope.callbacks && scope.callbacks.addDataBinding) {
      scope.callbacks.addDataBinding(binding)
    }
    return binding
  },

  dataBindingBuilder (dimension, data, selectorIn, hash) {
    const property = typeof selectorIn === 'string' ? selectorIn : undefined
    const selector = this.createSelector(selectorIn)
    const selectValue = (element) => selector(element)
    return DataBinding.create({ dimension, property, data, selector, selectValue })
  }

})

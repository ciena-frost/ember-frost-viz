import Ember from 'ember'

const ATTR_BLACKLIST = {
  attributeBindings: true,
  tagName: true,
  data: true,
  element: true
}

const ATTR_SUBSTITUTION_MAP = {}

/**
 * A mixin that passes through all attributes unless they are on a blacklist.
 */
export default Ember.Mixin.create({
  init () {
    this._super(...arguments)
    const attrs = this.attrs
    const attributeBindings = this.get('attributeBindings')
    const element = this.get('item')
    const attrBlacklist = Object.assign({}, ATTR_BLACKLIST, this.get('attrBlacklist') || {})
    const attrSubstitutions = Object.assign({}, ATTR_SUBSTITUTION_MAP, this.get('attrSubstitutions') || {})
    for (let inputProperty in attrs) {
      if (attrBlacklist[inputProperty]) continue

      const rawVal = this.get(inputProperty)
      const outputProperty = attrSubstitutions[inputProperty] || inputProperty
      let sourceProperty = inputProperty

      let val = rawVal
      if (rawVal.hasOwnProperty('evaluateElement')) {
        val = rawVal.evaluateElement(element)
      } else if (typeof rawVal === 'function') {
        val = rawVal(element)
      }

      if (val !== rawVal) {
        sourceProperty = `_${inputProperty}`
        Ember.set(this, sourceProperty, val)
      }

      const binding = sourceProperty === outputProperty
        ? sourceProperty
        : `${sourceProperty}:${outputProperty}`
      attributeBindings.push(binding)
    }
  }
})

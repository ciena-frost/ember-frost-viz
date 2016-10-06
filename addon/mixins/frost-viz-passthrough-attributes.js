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
  handleInputProperty (inputProperty, element, attributeBindings, attrBlacklist, attrSubstitutions) {
    if (attrBlacklist[inputProperty]) return

    const outputProperty = attrSubstitutions[inputProperty] || inputProperty
    let sourceProperty = inputProperty

    const binding = sourceProperty === outputProperty
      ? sourceProperty
      : `${sourceProperty}:${outputProperty}`
    attributeBindings.push(binding)
  },

  init () {
    this._super(...arguments)
    const attrs = this.attrs
    const attributeBindings = this.get('attributeBindings') || this.set('attributeBindings', Ember.A([]))
    const element = this.get('item')
    const attrBlacklist = Object.assign({}, ATTR_BLACKLIST, this.get('attrBlacklist') || {})
    const attrSubstitutions = Object.assign({}, ATTR_SUBSTITUTION_MAP, this.get('attrSubstitutions') || {})
    for (let inputProperty in attrs) {
      this.handleInputProperty(inputProperty, element, attributeBindings, attrBlacklist, attrSubstitutions)
    }
  }
})

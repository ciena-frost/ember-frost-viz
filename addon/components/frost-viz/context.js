import Ember from 'ember'
import layout from '../../templates/components/frost-viz/context'
import ScopeProvider from 'ciena-frost-viz/mixins/frost-viz-scope-provider'

const GenericScope = Ember.Object.extend()

const Context = Ember.Component.extend(ScopeProvider, {
  tagName: '',
  layout,
  childScope: Ember.computed('childScopeBase', 'inject', 'inject.@each', function () {
    const inject = this.get('inject')
    const result = GenericScope.create(this.get('childScopeBase'), inject)
    return result
  })
})

Context.reopenClass({
  positionalParams: ['scope', 'inject']
})

export default Context

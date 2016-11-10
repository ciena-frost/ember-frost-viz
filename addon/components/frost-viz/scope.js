import Ember from 'ember'
import layout from '../../templates/components/frost-viz/scope'
import ScopeProvider from 'ciena-frost-viz/mixins/frost-viz-scope-provider'
import PropTypesMixin, {PropTypes} from 'ember-prop-types'

const GenericScope = Ember.Object.extend()

const Scope = Ember.Component.extend(ScopeProvider, {
  tagName: '',
  layout,

  // TODO: this surprisingly appears to break all the things
  propTypes: {
  //   inject: PropTypes.oneOf([
  //     PropTypes.object,
  //     PropTypes.EmberObject
  //   ])
    scope: PropTypes.EmberObject.isRequired
  },
  // getDefaultProps () {
  //   inject: null
  // },

  childScope: Ember.computed('childScopeBase', 'inject', 'inject.@each', function () {
    const inject = this.get('inject')
    const result = GenericScope.create(this.get('childScopeBase'), inject)
    return result
  })
})

Scope.reopenClass({
  positionalParams: ['scope', 'inject']
})

export default Scope

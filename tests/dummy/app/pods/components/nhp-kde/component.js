import Ember from 'ember'
import layout from './template'

const KDEComponent = Ember.Component.extend({
  layout
})

KDEComponent.reopenClass({
  positionalParams: ['data']
})

export default KDEComponent

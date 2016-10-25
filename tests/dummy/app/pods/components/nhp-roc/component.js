import Ember from 'ember'
import layout from './template'

const ROCComponent = Ember.Component.extend({
  layout
})

ROCComponent.reopenClass({
  positionalParams: ['data']
})

export default ROCComponent

import Ember from 'ember'
import layout from './template'

const NHPFit = Ember.Component.extend({
  layout
})

NHPFit.reopenClass({
  positionalParams: ['data']
})

export default NHPFit

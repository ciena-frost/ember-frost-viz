import Ember from 'ember'
import layout from './template'

const KDEComponent = Ember.Component.extend({
  layout,
  classNames: ['nhp-kde']
})

KDEComponent.reopenClass({
  positionalParams: ['data']
})

export default KDEComponent

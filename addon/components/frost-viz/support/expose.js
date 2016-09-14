import Ember from 'ember'
const {hbs} = Ember

const Component = Ember.Component.extend({
  layout: hbs`{{yield model}}`,
  model: null
})

Component.reopenClass({
  positionalParams: ['model']
})

export default Component

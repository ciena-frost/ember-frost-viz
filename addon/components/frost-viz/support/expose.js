import Ember from 'ember'
const {Component, hbs} = Ember

const Expose = Component.extend({
  layout: hbs`{{yield model}}`,
  model: null
})

Expose.reopenClass({
  positionalParams: ['model']
})

export default Expose

import Ember from 'ember'
const {Component} = Ember
import layout from '../../../../templates/components/frost-viz/scale/tick/label'

const LabelComponent = Component.extend({
  layout,
  tagName: 'g'
})

LabelComponent.reopenClass({
  positionalParams: ['label']
})

export default LabelComponent

import Ember from 'ember'
import layout from '../../../../templates/components/frost-viz/scale/tick/label'

const LabelComponent = Ember.Component.extend({
  layout,
  tagName: 'g'
})

LabelComponent.reopenClass({
  positionalParams: ['label']
})

export default LabelComponent

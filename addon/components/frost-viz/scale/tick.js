import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/scale/tick'

const TickComponent = Ember.Component.extend({
  layout,
  tagName: 'g',
  line: Ember.computed.oneWay('tick.line'),
  label: Ember.computed.oneWay('tick.label')
})

TickComponent.reopenClass({
  positionalParams: ['tick']
})

export default TickComponent

import Ember from 'ember'
const {Component, computed} = Ember
import layout from '../../../templates/components/frost-viz/scale/tick'

const TickComponent = Component.extend({
  layout,
  tagName: 'g',
  line: computed.oneWay('tick.line'),
  label: computed.oneWay('tick.label')
})

TickComponent.reopenClass({
  positionalParams: ['tick']
})

export default TickComponent

import Ember from 'ember'
import layout from '../../../../../templates/components/frost-viz/plot/element/symbol/circle'
import PassthroughAttributes from 'ciena-frost-viz/mixins/frost-viz-passthrough-attributes'
import Interactions from 'ciena-frost-viz/mixins/frost-viz-element-interactions'

const Component = Ember.Component.extend(PassthroughAttributes, Interactions, {
  layout,
  tagName: 'circle',
  attributeBindings: ['cx', 'cy'],
  cx: Ember.computed.oneWay('item.x'),
  cy: Ember.computed.oneWay('item.y')
})

Component.reopenClass({
  positionalParams: ['item']
})

export default Component

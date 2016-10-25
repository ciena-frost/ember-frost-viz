import Ember from 'ember'
import layout from '../../../../templates/components/frost-viz/plot/element/line-segment'
import PassthroughAttributes from 'ciena-frost-viz/mixins/frost-viz-passthrough-attributes'

const Component = Ember.Component.extend(PassthroughAttributes, {
  layout,
  tagName: 'g',
  x1: Ember.computed.alias('begin.x'),
  y1: Ember.computed.alias('begin.y'),
  x2: Ember.computed.alias('end.x'),
  y2: Ember.computed.alias('end.y')
})

Component.reopenClass({
  positionalParams: ['begin', 'end']
})

export default Component

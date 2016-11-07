import Ember from 'ember'
import layout from 'ciena-frost-viz/templates/components/frost-viz/plot/element/line-segment'

const Component = Ember.Component.extend({
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

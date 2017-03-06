import Ember from 'ember'
const {Component, computed} = Ember
import layout from 'ember-frost-viz/templates/components/frost-viz/plot/element/line-segment'

const LineSegment = Component.extend({
  layout,
  tagName: 'g',
  x1: computed.alias('begin.x'),
  y1: computed.alias('begin.y'),
  x2: computed.alias('end.x'),
  y2: computed.alias('end.y')
})

LineSegment.reopenClass({
  positionalParams: ['begin', 'end']
})

export default LineSegment

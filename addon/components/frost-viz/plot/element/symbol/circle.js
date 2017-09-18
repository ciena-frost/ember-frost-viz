import Ember from 'ember'
const {Component, computed} = Ember
import {PropTypes} from 'ember-prop-types'

const DEFAULT_RADIUS = 4.0

// Example symbol.
const Circle = Component.extend({
  tagName: 'circle',
  attributeBindings: ['cx', 'cy', 'r', 'fill'],

  r: DEFAULT_RADIUS,
  cx: computed.oneWay('item.x'),
  cy: computed.oneWay('item.y')
})

Circle.reopenClass({
  positionalParams: ['item']
})

export default Circle

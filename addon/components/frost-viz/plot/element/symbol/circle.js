import Ember from 'ember'
const {Component, computed} = Ember
import {PropTypes} from 'ember-prop-types'

const DEFAULT_RADIUS = 4.0

// Example symbol.
const Circle = Component.extend(PropTypes, {
  tagName: 'circle',
  attributeBindings: ['cx', 'cy', 'r', 'fill'],

  propTypes: {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    r: PropTypes.number
  },
  getDefaultProps () {
    return {
      r: DEFAULT_RADIUS
    }
  },

  cx: computed.oneWay('item.x'),
  cy: computed.oneWay('item.y')
})

Circle.reopenClass({
  positionalParams: ['item']
})

export default Circle

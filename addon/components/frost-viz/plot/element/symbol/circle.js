import Ember from 'ember'
import { PropTypes } from 'ember-prop-types'

const DEFAULT_RADIUS = 4.0

// Example symbol.
const Component = Ember.Component.extend(PropTypes, {
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

  cx: Ember.computed.oneWay('item.x'),
  cy: Ember.computed.oneWay('item.y')
})

Component.reopenClass({
  positionalParams: ['item']
})

export default Component

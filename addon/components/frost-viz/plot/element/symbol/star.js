import Ember from 'ember'
const {Component, computed} = Ember
import {PropTypes} from 'ember-prop-types'

export default Component.extend({
  tagName: 'polygon',
  attributeBindings: ['points'],

  propTypes: {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    rays: PropTypes.number,
    theta: PropTypes.number
  },
  getDefaultProps () {
    return {
      innerRadius: 5.0,
      outerRadius: 12.0,
      rays: 5,
      theta: 90.0
    }
  },

  points: computed(
    'cx', 'cy', 'innerRadius', 'outerRadius', 'rays', 'theta',
  function () {
    const cx = this.get('cx')
    const cy = this.get('cy')
    const outerRadius = this.get('outerRadius')
    const innerRadius = this.get('innerRadius')
    const startAngle = this.get('theta')
    const points = this.get('rays')
    const vertices = points * 2
    const deltaAngle = 360.0 / vertices
    const result = []
    for (let i = 0; i < vertices; ++i) {
      const radius = (i % 2) ? outerRadius : innerRadius
      const angle = (startAngle + (deltaAngle * i)) * Math.PI / 180
      const offsetX = Math.cos(angle) * radius
      const offsetY = Math.sin(angle) * radius
      result.push(`${offsetX + cx},${offsetY + cy}`)
    }
    return result.join(' ')
  })
})

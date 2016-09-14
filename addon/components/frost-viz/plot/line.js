import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/plot/line'
import ElementBuilder from 'ciena-frost-viz/mixins/frost-viz-element-builder'

const Line = Ember.Component.extend(ElementBuilder, {
  layout,
  classNames: ['frost-viz-plot-line'],

  lines: Ember.computed('elements', function () {
    const elements = this.get('elements')
    if (!elements) return Ember.A([])
    const result = elements.map((val, index, array) => [val, array[index + 1]]).slice(0, -1)
    return result
  })
})

Line.reopenClass({
  positionalParams: ['transformScope']
})

export default Line

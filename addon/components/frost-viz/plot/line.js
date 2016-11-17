import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/plot/line'
import Plotter from 'ciena-frost-viz/mixins/frost-viz-plotter'

const Line = Ember.Component.extend(Plotter, {
  layout,
  classNames: ['frost-viz-plot-line'],

  lines: Ember.computed('data', 'elements', 'elementGenerate', function () {
    const data = this.get('data')
    const elements = this.get('elements')
    const elementGenerate = this.get('elementGenerate')
    if (!elements) return Ember.A([])
    return elements.map(
      (el, index, array) => elementGenerate(el, data, {start: el, end: array[index + 1]})).slice(0, -1)
  })
})

Line.reopenClass({
  positionalParams: ['scope']
})

export default Line

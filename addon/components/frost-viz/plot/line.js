import Ember from 'ember'
const {A, Component, computed} = Ember
import layout from '../../../templates/components/frost-viz/plot/line'
import Plotter from 'ember-frost-viz/mixins/frost-viz-plotter'

const Line = Component.extend(Plotter, {
  layout,
  classNames: ['frost-viz-plot-line'],

  lines: computed('data', 'elements', 'elementGenerate', function () {
    const data = this.get('data')
    const elements = this.get('elements')
    const elementGenerate = this.get('elementGenerate')
    if (!elements) return A([])
    return elements.map(
      (el, index, array) => elementGenerate(el, data, {start: el, end: array[index + 1]})).slice(0, -1)
  })
})

Line.reopenClass({
  positionalParams: ['scope']
})

export default Line

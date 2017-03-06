import Ember from 'ember'
const {Component} = Ember
import layout from '../../../templates/components/frost-viz/plot/scatter'
import Plotter from 'ember-frost-viz/mixins/frost-viz-plotter'

const Scatter = Component.extend(Plotter, {
  layout,
  classNames: ['frost-viz-plot-scatter']
})

Scatter.reopenClass({
  positionalParams: ['scope']
})

export default Scatter

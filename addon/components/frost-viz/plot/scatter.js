import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/plot/scatter'
import Plotter from 'ember-frost-viz/mixins/frost-viz-plotter'

const Scatter = Ember.Component.extend(Plotter, {
  layout,
  classNames: ['frost-viz-plot-scatter']
})

Scatter.reopenClass({
  positionalParams: ['scope']
})

export default Scatter

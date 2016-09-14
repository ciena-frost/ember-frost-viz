import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/plot/scatter'
import ElementBuilder from 'ciena-frost-viz/mixins/frost-viz-element-builder'

const Scatter = Ember.Component.extend(ElementBuilder, {
  layout,
  classNames: ['frost-viz-plot-scatter']
})

Scatter.reopenClass({
  positionalParams: ['transformScope']
})

export default Scatter

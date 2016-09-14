import Ember from 'ember'
import DimensionBase from 'ember-frost-viz/mixins/frost-viz-dimension'
import D3DimensionTicks from 'ember-frost-viz/mixins/frost-viz-dimension-d3-ticks'
import { scaleLinear } from 'd3-scale'

export default Ember.Helper.extend(DimensionBase, D3DimensionTicks, {
  mapperBuilder (domain, range) {
    return scaleLinear().domain(domain).range(range)
  }
})

import {scaleLinear} from 'd3-scale'
import Ember from 'ember'
const {Helper} = Ember
import DimensionBase from 'ember-frost-viz/mixins/frost-viz-dimension'
import D3DimensionTicks from 'ember-frost-viz/mixins/frost-viz-dimension-d3-ticks'

export default Helper.extend(DimensionBase, D3DimensionTicks, {
  mapperBuilder (domain, range) {
    return scaleLinear().domain(domain).range(range)
  }
})

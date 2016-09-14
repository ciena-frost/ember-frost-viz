import Ember from 'ember'
import DimensionBase from 'ciena-frost-viz/mixins/frost-viz-dimension'
import D3DimensionTicks from 'ciena-frost-viz/mixins/frost-viz-dimension-d3-ticks'
import { scaleTime } from 'd3-scale'
import { isoParse } from 'd3-time-format'

export default Ember.Helper.extend(DimensionBase, D3DimensionTicks, {

  parser: isoParse,

  mapperBuilder (domain, range) {
    return scaleTime().domain(domain).range(range)
  }

})

import {scaleTime} from 'd3-scale'
import {isoParse} from 'd3-time-format'
import Ember from 'ember'
const {Helper} = Ember
import DimensionBase from 'ember-frost-viz/mixins/frost-viz-dimension'
import D3DimensionTicks from 'ember-frost-viz/mixins/frost-viz-dimension-d3-ticks'

export default Helper.extend(DimensionBase, D3DimensionTicks, {

  parser: isoParse,

  mapperBuilder (domain, range) {
    return scaleTime().domain(domain).range(range)
  }

})

import Ember from 'ember'
import DimensionBase from 'ember-frost-viz/mixins/frost-viz-dimension'
import D3DimensionTicks from 'ember-frost-viz/mixins/frost-viz-dimension-d3-ticks'
import { scaleLog } from 'd3-scale'

const DEFAULT_MIN = 1e-100

/**
 * Logarithm dimension helper
 *
 * lg(0) = ∞
 * This is easy to stumble on and can easily happen in dynamic data sets.
 * Tweak positive log ranges that start at 0 and negative log ranges that end at 0. Note that this can put the
 * extrema with the smallest absolute value out of range. Where this is a problem, manually set the domain.
 *
 * @type {object}
 */
export default Ember.Helper.extend(DimensionBase, D3DimensionTicks, {
  domainCleanup (domain) {
    const [min, max] = domain
    return [
      min === 0 ? DEFAULT_MIN : min,
      max === 0 ? -DEFAULT_MIN : max
    ]
  },

  domainBuilder (elements) {
    return this.domainCleanup(this._super(elements))
  },

  mapperBuilder (domain, range) {
    const cleanDomain = this.domainCleanup(domain)
    return scaleLog().domain(cleanDomain).range(range)
  },

  tickBuilder (domain, range) {
    const cleanDomain = this.domainCleanup(domain)
    return this.mapperBuilder(cleanDomain, range).ticks
  }
})

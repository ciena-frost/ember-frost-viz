import Ember from 'ember'
const {Mixin} = Ember

/**
 * The tick builder function signature for frost-viz is based on d3, which exposes the tick builder as a property on
 * the mapper function. If a dimension creates a D3 mapper, we can automatically provide the tick builder.
 */
export default Mixin.create({
  tickBuilder (domain, range) {
    const mapperBuilder = this.get('mapperBuilder')
    return mapperBuilder(domain, range).ticks
  }
})

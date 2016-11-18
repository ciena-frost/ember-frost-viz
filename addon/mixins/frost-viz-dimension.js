import Ember from 'ember'

/**
 * @module mixinDimensionBase
 * Dimension objects extending this mixin:
 *  -> MUST implement mapperBuilder;
 *  -> MUST implement tickBuilder;
 *  -> MAY implement parser if the mapper does not operate directly on the input data type;
 *  -> MAY implement domainBuilder if the elements in the data set do not implement .valueOf in such a way that > < can
 *     be used in pairwise comparisons to determine domain extrema
 *
 * Ideally, a dimension mapping function would be stateless.  With lazy domains, the values from which the domain should
 * be calculated are not immediately available.
 *
 * In the eager domain case, the helper builds the mapping function and it is directly used.
 *
 * In the lazy domain case, we return a dimension with most of its public API unbound. The domain manager mixin detects
 * this and behaves appropriately. See ember-frost-viz/mixins/frost-viz-dimension-manager
 **/

const fUndef = () => undefined

const Dimension = Ember.Object.extend({
  init () {
    this._super(...arguments)
    this.set('dataBindings', Ember.A([]))
  },

  inclusiveDomain (domains) {
    // Set the inclusive domain to the first low-high pair
    const seed = domains[0]
    // Expand for any other low-high pair that extends the range
    return domains.slice(1).reduce((prev, curr) => [ Math.min(prev[0], curr[0]), Math.max(prev[1], curr[1]) ], seed)
  },
  scope: null,
  domain: null,
  range: null,
  valueParser: fUndef,
  evaluateValue: fUndef,
  evaluateElement: fUndef,
  ticks: fUndef,
  computeDomain: fUndef
})

/**
 * Dimension base Mixin
 *
 * @param  {function} mapperBuilder A function(domain, range) that generates a mapping function(element) from domain to
 *                                  range.
 * @param  {function} tickBuilder A function(domain, range) that generates a tick value generating function(count).
 *                                The tick value function should return an array of approximately (count) elements
 *                                in the given domain, that are approximately equidistant when mapped to the given
 *                                range.
 * @param  {object} domain A predefined domain (array[2]), or a function(elements) that generates a domain from the
 *                         input data.
 * @param  {array} range A predefined output range for the mapper, array[2]
 * @param  {function} parser A function(value) that transforms the selected property of an input element into a format
 *                           suitable for the mapper function.
 * @param  {function} domainBuilder The default domain-generating function(elements) for this data type.
 * @return {function} compute The function(params, hash) that generates the mapping function.
 */
export default Ember.Mixin.create({

  mapperBuilder: null,
  tickBuilder: null,

  domain: null,
  range: [0, 1],

  parser (v) {
    return (v === undefined) ? undefined : (Number(v) || 0)
  },

  domainBuilder (elements) {
    // Math.max.apply on very large arrays can blow the stack. This is more robust.
    // It also works on objects that are non-numeric, but still comparable, like
    // strings and Dates. (Tip: implement valueOf)
    return [
      elements.reduce((a, b) => a < b ? a : b),
      elements.reduce((a, b) => a > b ? a : b)
    ]
  },

  /**
   * Computes the dimension mapping function.
   * @param  {array} params [scope obj, {string | function} Property selector from this element]
   *                        The scope object provides an action for registering this dimension, so that its domain
   *                        can be automatically updated on changes to data.
   *                        The selector object specifies a string (property name) or a function(element).
   *                        If a string is provided, the data for this dimension is expected in element[property name].
   *                        If a function is provided, the data for this dimension is returned by function(element).
   * @param  {object} hash Named parameters:
   *                        parser:  {function(property)} An override for the parsing function
   *                        range:   {array[2]} A non-standard range; default is [0, 1]
   *                        domain:  {array[2] | function(elements)} A predefined domain or domain-generating function
   * @returns {object} result
   *            {array} domain domain
   *            {array} range range
   *            {function} evaluateValue The mapping function(value) from a value in the domain to the range.
   *            {function} evaluateElement The mapping function(element) from an element to the range.
   *            {function} ticks The ticks generating function(count).
   *
   *
   */
  compute (params, hash) {
    const scope = params.shift()
    Ember.assert('dimension: Scope object not passed or not valid', Ember.typeOf(scope) === 'instance')
    const selectorIn = params.shift()
    const dimension = this.buildDimension(scope, selectorIn, hash)
    if (scope && scope.callbacks && scope.callbacks.addDimension) {
      scope.callbacks.addDimension(dimension)
    }
    return dimension
  },

  buildDimension (scope, selectorIn, hash) {
    // Build selector
    // Pull defaults from this, override by hash properties
    const { parser, range, domain } = Object.assign({},
      this.getProperties('parser', 'range', 'domain'),
      hash)

    // const elementFunc = (element, binding) => parser(binding.selector(element))

    // This should return a function that maps parsed values from domain to range.
    const rawMapperBuilder = this.get('mapperBuilder').bind(this)

    // This should return a function that produces tick values in the range.
    const tickBuilder = this.get('tickBuilder').bind(this)

    const valueEvaluatorBuilder = function (dom, rng) {
      if (!dom) return fUndef
      const rawMapper = rawMapperBuilder(dom.map(parser), rng)
      return (value) => {
        if (value === undefined) return value
        const parsedValue = parser(value)
        return (parsedValue === undefined) ? parsedValue : rawMapper(parsedValue)
      }
    }

    const elementEvaluatorBuilder = function (dom, rng) {
      const valueEvaluator = valueEvaluatorBuilder(dom, rng)
      return (element, binding) => valueEvaluator(binding.selector(element))
    }

    const result = Dimension.create({scope, range})

    // Easy case: static domain.
    if (domain && Array.isArray(domain)) {
      // If domain is already resolved, then we can evaluate everything now.
      // Return a bound and prepared mapper.
      const processedDomain = domain.map(parser)
      result.setProperties({
        domain: processedDomain,
        valueParser: parser,
        evaluateValue: valueEvaluatorBuilder(processedDomain, range),
        evaluateElement: elementEvaluatorBuilder(processedDomain, range),
        ticks: tickBuilder(processedDomain, range)
      })
    } else {
      // Determine whether we were passed functions to use, or binding arguments
      // for the standard functions.
      // The domain builder operates on an array of parsed, selected values.
      const domainFunc = typeof domain === 'function' ? domain : this.get('domainBuilder')
      // Return a dimension that redefines its mappers and tick functions when its domain changes.
      result.setProperties({
        range,
        dataBindings: Ember.A([]),

        domainBuilder () {
          const dataBindings = this.get('dataBindings')
          Ember.assert('dimension: Building domain: dataBindings not provided', dataBindings && dataBindings.length)
          const domains = []
          for (let binding of dataBindings) {
            const data = binding.get('data')
            const elementFunc = (element) => parser(binding.selector(element))
            const elementData = data.map(elementFunc).filter(v => v !== undefined)
            domains.push(domainFunc(elementData))
          }
          return result.inclusiveDomain(domains)
        },

        computeDomain () {
          const domain = this.domainBuilder()
          this.setProperties({
            domain,
            evaluateValue: valueEvaluatorBuilder(domain, range),
            evaluateElement: elementEvaluatorBuilder(domain, range),
            ticks: tickBuilder(domain, range)
          })
        }
      })
    }
    return result
  }

})

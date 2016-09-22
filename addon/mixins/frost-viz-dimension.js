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
 * this and behaves appropriately. See ciena-frost-viz/mixins/frost-viz-dimension-manager
 **/

const fUndef = () => undefined

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
    return Number(v) || 0
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

  createSelector (selectorProperty) {
    if (typeof selectorProperty === 'function') {
      return selectorProperty
    }
    if (typeof selectorProperty === 'string') {
      return (v) => Ember.get(v, selectorProperty)
    }
    return (v) => v
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
    // Unpack arguments
    // console.log('Creating dimension', params)
    const scope = params.shift()
    Ember.assert('Scope object not passed or not valid', Ember.typeOf(scope) === 'object')
    const dimension = this.buildDimension(params, hash)
    if (scope && scope.callbacks && scope.callbacks.addDimension) scope.callbacks.addDimension(dimension)
    return dimension
  },

  buildDimension (params, hash) {
    // Build selector
    const selector = this.createSelector(params.shift())
    // Pull defaults from this, override by hash properties
    const { parser, range, domain } = Object.assign({},
      this.getProperties('parser', 'range', 'domain'),
      hash)

    const elementFunc = (element) => parser(selector(element))

    // This should return a function that maps parsed values from domain to range.
    const rawMapperBuilder = this.get('mapperBuilder').bind(this)

    // This should return a function that produces tick values in the range.
    const tickBuilder = this.get('tickBuilder').bind(this)

    const valueEvaluatorBuilder = function (dom, rng) {
      if (!dom) return fUndef
      const rawMapper = rawMapperBuilder(dom.map(parser), rng)
      return (value) => rawMapper(parser(value))
    }

    const elementEvaluatorBuilder = function (dom, rng) {
      const valueEvaluator = valueEvaluatorBuilder(dom, rng)
      return (element) => valueEvaluator(selector(element))
    }

    // Easy case: static domain.
    if (domain && Array.isArray(domain)) {
      const processedDomain = domain.map(parser)

      // If domain is already resolved, then we can evaluate everything now.
      // Return a bound and prepared mapper.
      return Ember.Object.create({
        domain: processedDomain,
        range,
        valueParser: parser,
        evaluateValue: valueEvaluatorBuilder(processedDomain, range),
        evaluateElement: elementEvaluatorBuilder(processedDomain, range),
        ticks: tickBuilder(processedDomain, range)
      })
    }

    // Determine whether we were passed functions to use, or binding arguments
    // for the standard functions.
    // The domain builder operates on an array of parsed, selected values.
    const domainFunc = typeof domain === 'function' ? domain : this.get('domainBuilder').bind(this)
    const domainBuilder = (data) => data && domainFunc(data.map(elementFunc)) || undefined
    domainBuilder.bind(this)

    // Return a dimension that rebuilds its mappers and tick functions when its domain changes.
    return Ember.Object.create({
      domain: null,
      range,
      evalValueFunc: null,
      evalElementFunc: null,
      tickFunc: null,

      evaluateValue (value) {
        return this.evalValueFunc(value)
      },

      evaluateElement (element) {
        return this.evalElementFunc(element)
      },

      ticks (count) {
        return this.tickFunc(count)
      },

      computeDomain (data) {
        if (data === undefined) throw new Error('Domain not set and data not provided')
        this.set('domain', domainBuilder(data))
        this.set('evalValueFunc', valueEvaluatorBuilder(this.domain, range))
        this.set('evalElementFunc', elementEvaluatorBuilder(this.domain, range))
        this.set('tickFunc', tickBuilder(this.domain, range))
      }
    })
  }

})

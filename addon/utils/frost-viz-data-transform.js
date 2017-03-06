import Ember from 'ember'
const {A, get, set} = Ember

/**
 * An analog of Array.map that operates on object key-value pairs. Returns an
 * object out such that, for every key in obj, out[key] = func(key, obj[key], obj).
 * @param   {Object} obj                        The object to transform
 * @param   {function} func                     The transform function(key, value, object)
 * @returns {Object}                            The transformed properties
 */
export function mapObj (obj, func) {
  const result = Ember.Object.create()
  Object.keys(obj).forEach((key) => set(result, key, func(key, get(obj, key), obj)))
  return result
}

/**
 * Takes a map of function objects (e.g. an Ember actions object) and returns a similar map in which
 * all functions are bound to the target.
 * @param  {object} map    The map of functions
 * @param  {object} target The target to which all function values should be mapped
 * @returns {object}        A map of bound functions
 */
export function bindFunctionMap (map, target) {
  return mapObj(map || {}, (key, func) => func.bind(target))
}

/**
 * An Emberized version of Object.values that uses Ember.get(). Returns an Array
 * containing the property value for each property in obj.
 * @param   {Object} obj        The object from which to take property values.
 *                              (If the object is an array, the same array will be returned.)
 * @returns {Array}             The property values in obj.
 */
export function objectValues (obj) {
  const vals = A([])
  if (Array.isArray(obj)) return obj
  const keys = Object.keys(obj)
  for (var key of keys) {
    if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
      vals.push(get(obj, key))
    }
  }
  return vals
}

/**
 * Filters the given object by returning a new object containing only the
 * specified keys.
 * @param   {Object} obj            The object to filter
 * @param   {Array} keys            The keys to return
 * @returns {Object}                A new object containing the specified
 *                                    properties from obj
 */
export function filterKeys (obj, ...keys) {
  const out = {}
  keys.forEach(function (key) {
    const val = get(obj, key)
    if (val !== undefined) out[key] = val
  })
  return out
}

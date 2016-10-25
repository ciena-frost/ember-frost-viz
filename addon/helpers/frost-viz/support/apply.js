import Ember from 'ember'

const NULL_FUNC = (x) => x

export function frostVizApply (params/*, hash*/) {
  const func = params && params.shift() || NULL_FUNC
  Ember.assert(`apply: Expected function but got ${typeof func}`, typeof func === 'function' || !func)
  return func.apply(null, params)
}

export default Ember.Helper.helper(frostVizApply)

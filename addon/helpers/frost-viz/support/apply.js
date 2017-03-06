import Ember from 'ember'
const {Helper, assert} = Ember

const NULL_FUNC = (x) => x

export function frostVizApply (params/*, hash*/) {
  const func = params && params.shift() || NULL_FUNC
  assert(`apply: Expected function but got ${typeof func}`, typeof func === 'function' || !func)
  return func.apply(null, params)
}

export default Helper.helper(frostVizApply)

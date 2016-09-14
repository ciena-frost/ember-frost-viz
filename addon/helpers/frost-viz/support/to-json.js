import Ember from 'ember'

export function frostVizTestToJson (params/*, hash*/) {
  return params.length && params.length === 1
    ? JSON.stringify(params[0])
    : JSON.stringify(...params)
}

export default Ember.Helper.helper(frostVizTestToJson)

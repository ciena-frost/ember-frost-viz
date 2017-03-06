import Ember from 'ember'
const {Helper} = Ember

export function frostVizTestToJson (params/*, hash*/) {
  return params.length && params.length === 1
    ? JSON.stringify(params[0])
    : JSON.stringify(...params)
}

export default Helper.helper(frostVizTestToJson)

export const has = function (a, elt) {
  return a.indexOf(elt) >= 0
}

export const difference = function (a, b) {
  return [...a].filter((x) => !has(b, x))
}

export const intersection = function (a, b) {
  return [...a].filter((x) => has(b, x))
}

// How did we decide no-undef:true typeof:true was a good idea?
/* global Set:true */ // this may be false
export const union = typeof Set !== 'undefined'
  ? function (a, b) {
    return new Set([...a, ...b])
  }
  : function (a, b) {
    return [...a, ...difference(b, a)]
  }

export default { has, difference, intersection, union }

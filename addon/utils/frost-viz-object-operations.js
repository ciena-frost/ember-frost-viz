import Ember from 'ember'
import { intersection } from './frost-viz-set-operations'
const {
  get
} = Ember

/**
 * Returns true if specified or common attributes are equal
 * @param  {object} obj1         The first object to compare
 * @param  {object} obj2         The second object to compare
 * @param  {array} [attrs=null]  The attribute names to compare. If null, compares all attributes in common.
 * @returns {boolean}            false if any attributes were unequal, true otherwise
 */
export function attributesEqual (obj1, obj2, attrs = null) {
  if (attrs == null) {
    return attributesEqual(obj1, obj2,
      intersection(Object.keys(obj1), Object.keys(obj2)))
  }

  for (let key of attrs) {
    if (get(obj1, key) !== get(obj2, key)) return false
  }
  return true
}

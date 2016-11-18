import Ember from 'ember'
import Rectangle from 'ember-frost-viz/utils/frost-viz-rectangle'
const {
  computed,
  get
} = Ember

  // Emulating
  // https://github.com/emberjs/ember.js/blob/v2.9.1/packages/ember-runtime/lib/computed/computed_macros.js
function rectangle (dependentKey) {
  return computed(dependentKey, `${dependentKey}.{x,y,width,height}`, function () {
    return Rectangle.from(get(this, dependentKey))
  })
}

export default {
  rectangle
}

import Ember from 'ember'
import { bindFunctionMap } from 'ciena-frost-viz/utils/frost-viz-data-transform'

export default Ember.Mixin.create({
  mergedProperties: ['callbacks'],
  childScopeBase: Ember.computed('scope', 'scope.callbacks', 'data', 'data.[]', 'innerArea', function () {
    const data = this.get('data')
    const myCallbacks = bindFunctionMap(this.get('callbacks'), this) // pass all callbacks as bound functions
    const parent = this.get('scope')
    const parentCallbacks = this.get('scope.callbacks')
    const callbacks = Object.assign({}, parentCallbacks, myCallbacks)
    const area = this.get('innerArea')
    return {data, parent, area, callbacks}
  })
})

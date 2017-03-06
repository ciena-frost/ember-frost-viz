import Ember from 'ember'
const {A, Mixin} = Ember

export default Mixin.create({
  init () {
    this._super(...arguments)
    this.set('_destroyStack', A([]))
  },

  onDestroy (func) {
    this.get('_destroyStack').push(func)
  },

  willDestroy () {
    const stack = this.get('_destroyStack')
    while (stack.length) {
      (stack.pop())()
    }
  }
})

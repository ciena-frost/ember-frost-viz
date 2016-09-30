import Ember from 'ember'

export default Ember.Mixin.create({
  init () {
    this._super(...arguments)
    this.set('_destroyStack', Ember.A([]))
  },

  onDestroy (func) {
    this.get('_destroyStack').push(func)
  },

  willDestroy () {
    const stack = this.get('_destroyStack')
    console.log('running', stack.length, 'tasks on destroy')
    while (stack.length) {
      (stack.pop())()
    }
  }
})

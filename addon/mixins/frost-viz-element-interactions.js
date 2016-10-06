import Ember from 'ember'

export default Ember.Mixin.create({
  mouseEnter () {
    this.get('item.callbacks').setSelection(this.get('elementId'), this.get('item'))
  },

  mouseLeave () {
    this.get('item.callbacks').clearSelection(this.get('elementId'), this.get('item'))
  }
})

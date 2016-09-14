import Ember from 'ember'

export default Ember.Mixin.create({
  mouseEnter () {
    this.get('item.actions').setSelection(this.get('elementId'), this.get('item'))
  },

  mouseLeave () {
    this.get('item.actions').clearSelection(this.get('elementId'), this.get('item'))
  }
})

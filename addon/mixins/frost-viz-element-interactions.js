import Ember from 'ember'
const {Mixin} = Ember

export default Mixin.create({
  mouseEnter () {
    this.get('item.callbacks').setSelection(this.get('elementId'), this.get('item'))
  },

  mouseLeave () {
    this.get('item.callbacks').clearSelection(this.get('elementId'), this.get('item'))
  }
})

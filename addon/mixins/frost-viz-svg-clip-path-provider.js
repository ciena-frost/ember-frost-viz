import Ember from 'ember'
const {Mixin, computed} = Ember
const {htmlSafe} = Ember.String

export default Mixin.create({
  clipPathId: computed('elementId', function () {
    return `frost-viz-clip-${this.get('elementId')}`
  }),
  clipPathStyle: computed('clipPathId', function () {
    return htmlSafe(`clip-path: url(#${this.get('clipPathId')});`)
  })
})

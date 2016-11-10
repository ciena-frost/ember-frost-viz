import Ember from 'ember'

export default Ember.Mixin.create({
  clipPathId: Ember.computed('elementId', function () {
    return `frost-viz-clip-${this.get('elementId')}`
  }),
  clipPathStyle: Ember.computed('clipPathId', function () {
    return Ember.String.htmlSafe(`clip-path: url(#${this.get('clipPathId')});`)
  })
})

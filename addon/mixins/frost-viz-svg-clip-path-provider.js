import Ember from 'ember'

export default Ember.Mixin.create({
  // This horribleness is a workaround for Ember's use of a <base> tag:
  // @see https://github.com/ember-cli/ember-cli/issues/2633
  // Expected fix in 2.7.0; TODO: verify
  clipPathId: Ember.computed('elementId', function () {
    return `frost-viz-clip-${this.get('elementId')}`
  }),
  clipPathStyle: Ember.computed('clipPathId', function () {
    return Ember.String.htmlSafe(
      'clip-path: url(' +
      `${window.location.href.replace(window.location.hash, '')}#${this.get('clipPathId')}` +
      ');')
  })
})

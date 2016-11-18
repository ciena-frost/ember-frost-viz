/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizElementBuilderMixin from 'ember-frost-viz/mixins/frost-viz-element-builder'

describe('FrostVizElementBuilderMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizElementBuilderObject = Ember.Object.extend(FrostVizElementBuilderMixin)
    let subject = FrostVizElementBuilderObject.create()
    expect(subject).to.be.ok
  })
})

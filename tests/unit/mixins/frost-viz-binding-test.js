/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizBindingMixin from 'ember-frost-viz/mixins/frost-viz-binding'

describe('FrostVizBindingMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizBindingObject = Ember.Object.extend(FrostVizBindingMixin)
    let subject = FrostVizBindingObject.create()
    expect(subject).to.be.ok
  })
})

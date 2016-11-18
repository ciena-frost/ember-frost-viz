/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizDestroyStackMixin from 'ember-frost-viz/mixins/frost-viz-destroy-stack'

describe('FrostVizDestroyStackMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizDestroyStackObject = Ember.Object.extend(FrostVizDestroyStackMixin)
    let subject = FrostVizDestroyStackObject.create()
    expect(subject).to.be.ok
  })
})

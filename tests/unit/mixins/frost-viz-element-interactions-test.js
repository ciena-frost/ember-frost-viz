/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizElementInteractionsMixin from 'ember-frost-viz/mixins/frost-viz-element-interactions'

describe('FrostVizElementInteractionsMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizElementInteractionsObject = Ember.Object.extend(FrostVizElementInteractionsMixin)
    let subject = FrostVizElementInteractionsObject.create()
    expect(subject).to.be.ok
  })
})

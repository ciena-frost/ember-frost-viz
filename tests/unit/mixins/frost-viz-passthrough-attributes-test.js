/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizPassthroughAttributesMixin from 'ciena-frost-viz/mixins/frost-viz-passthrough-attributes'

describe('FrostVizPassthroughAttributesMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizPassthroughAttributesObject = Ember.Object.extend(FrostVizPassthroughAttributesMixin)
    let subject = FrostVizPassthroughAttributesObject.create()
    expect(subject).to.be.ok
  })
})

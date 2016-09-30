/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizFormatMixin from 'ciena-frost-viz/mixins/frost-viz-format'

describe('FrostVizFormatMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizFormatObject = Ember.Object.extend(FrostVizFormatMixin)
    let subject = FrostVizFormatObject.create()
    expect(subject).to.be.ok
  })
})

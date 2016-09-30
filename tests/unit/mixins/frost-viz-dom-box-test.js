/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizDomBoxMixin from 'ciena-frost-viz/mixins/frost-viz-dom-box'

describe('FrostVizDomBoxMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizDomBoxObject = Ember.Object.extend(FrostVizDomBoxMixin)
    let subject = FrostVizDomBoxObject.create()
    expect(subject).to.be.ok
  })
})

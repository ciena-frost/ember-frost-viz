/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizSvgTransformProviderMixin from 'ember-frost-viz/mixins/frost-viz-svg-transform-provider'

describe('FrostVizSvgTransformProviderMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizSvgTransformProviderObject = Ember.Object.extend(FrostVizSvgTransformProviderMixin)
    let subject = FrostVizSvgTransformProviderObject.create()
    expect(subject).to.be.ok
  })
})

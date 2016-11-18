/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizSvgTransformMixin from 'ember-frost-viz/mixins/frost-viz-svg-transform'

describe('FrostVizSvgTransformMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizSvgTransformObject = Ember.Object.extend(FrostVizSvgTransformMixin)
    let subject = FrostVizSvgTransformObject.create()
    expect(subject).to.be.ok
  })
})

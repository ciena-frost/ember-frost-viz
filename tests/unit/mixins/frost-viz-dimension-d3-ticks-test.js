/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizDimensionD3TicksMixin from 'ciena-frost-viz/mixins/frost-viz-dimension-d3-ticks'

describe('FrostVizDimensionD3TicksMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizDimensionD3TicksObject = Ember.Object.extend(FrostVizDimensionD3TicksMixin)
    let subject = FrostVizDimensionD3TicksObject.create()
    expect(subject).to.be.ok
  })
})

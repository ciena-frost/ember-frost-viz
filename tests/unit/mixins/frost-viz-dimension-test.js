/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import FrostVizDimensionMixin from 'ember-frost-viz/mixins/frost-viz-dimension';

describe('FrostVizDimensionMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let FrostVizDimensionObject = Ember.Object.extend(FrostVizDimensionMixin);
    let subject = FrostVizDimensionObject.create();
    expect(subject).to.be.ok;
  });
});

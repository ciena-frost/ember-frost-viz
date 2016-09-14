/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import FrostVizDimensionManagerMixin from 'ciena-frost-viz/mixins/frost-viz-dimension-manager';

describe('FrostVizDimensionManagerMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let FrostVizDimensionManagerObject = Ember.Object.extend(FrostVizDimensionManagerMixin);
    let subject = FrostVizDimensionManagerObject.create();
    expect(subject).to.be.ok;
  });
});

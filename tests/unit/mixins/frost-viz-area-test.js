/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import FrostVizAreaMixin from 'ember-frost-viz/mixins/frost-viz-area';

describe('FrostVizAreaMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let FrostVizAreaObject = Ember.Object.extend(FrostVizAreaMixin);
    let subject = FrostVizAreaObject.create();
    expect(subject).to.be.ok;
  });
});

/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import FrostVizSvgClipPathProviderMixin from 'ember-frost-viz/mixins/frost-viz-svg-clip-path-provider';

describe('FrostVizSvgClipPathProviderMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let FrostVizSvgClipPathProviderObject = Ember.Object.extend(FrostVizSvgClipPathProviderMixin);
    let subject = FrostVizSvgClipPathProviderObject.create();
    expect(subject).to.be.ok;
  });
});

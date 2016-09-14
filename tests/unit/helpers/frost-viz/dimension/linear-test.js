/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  frostVizDimensionLinear
} from 'ember-frost-viz/helpers/frost-viz/dimension/linear';

describe('FrostVizDimensionLinearHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = frostVizDimensionLinear(42);
    expect(result).to.be.ok;
  });
});

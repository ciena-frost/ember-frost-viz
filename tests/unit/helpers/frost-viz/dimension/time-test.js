/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  frostVizDimensionTime
} from 'ciena-frost-viz/helpers/frost-viz/dimension/time';

describe('FrostVizDimensionTimeHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = frostVizDimensionTime(42);
    expect(result).to.be.ok;
  });
});

/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  frostVizDimensionLog
} from 'ciena-frost-viz/helpers/frost-viz/dimension/log';

describe('FrostVizDimensionLogHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = frostVizDimensionLog(42);
    expect(result).to.be.ok;
  });
});

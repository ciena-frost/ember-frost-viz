/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  frostVizTimer
} from 'ciena-frost-viz/helpers/frost-viz/timer';

describe('FrostVizTimerHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = frostVizTimer(42);
    expect(result).to.be.ok;
  });
});

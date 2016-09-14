/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  frostVizSupportToJson
} from 'ember-frost-viz/helpers/frost-viz/support/to-json';

describe('FrostVizSupportToJsonHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = frostVizSupportToJson(42);
    expect(result).to.be.ok;
  });
});

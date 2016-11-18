/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import {
  frostVizFormatNumeric
} from 'ember-frost-viz/helpers/frost-viz/format/numeric'

describe('FrostVizFormatNumericHelper', function () {
  // Replace this with your real tests.
  it('works', function () {
    let result = frostVizFormatNumeric(42)
    expect(result).to.be.ok
  })
})

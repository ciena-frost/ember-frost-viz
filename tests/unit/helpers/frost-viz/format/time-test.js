/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import {
  frostVizFormatTime
} from 'ember-frost-viz/helpers/frost-viz/format/time'

describe('FrostVizFormatTimeHelper', function () {
  // Replace this with your real tests.
  it('works', function () {
    let result = frostVizFormatTime(42)
    expect(result).to.be.ok
  })
})

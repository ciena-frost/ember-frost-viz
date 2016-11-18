/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import {
  frostVizFormatDefault
} from 'ember-frost-viz/helpers/frost-viz/format/default'

describe('FrostVizFormatDefaultHelper', function () {
  // Replace this with your real tests.
  it('works', function () {
    let result = frostVizFormatDefault(42)
    expect(result).to.be.ok
  })
})

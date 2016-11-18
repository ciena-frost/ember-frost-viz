/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import polyfillMathSign from 'ember-frost-viz/utils/polyfill-math-sign'

describe('polyfillMathSign', function () {
  // Replace this with your real tests.
  it('works', function () {
    let result = polyfillMathSign()
    expect(result).to.be.ok
  })
})

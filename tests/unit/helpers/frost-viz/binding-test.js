/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import {
  frostVizBinding
} from 'ember-frost-viz/helpers/frost-viz/binding'

describe('FrostVizBindingHelper', function () {
  // Replace this with your real tests.
  it('works', function () {
    let result = frostVizBinding(42)
    expect(result).to.be.ok
  })
})

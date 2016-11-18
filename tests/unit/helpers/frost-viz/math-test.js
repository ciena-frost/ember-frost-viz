/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import {
  math
} from 'ciena-frost-viz/helpers/frost-viz/math'

describe('FrostVizMathHelper', function () {
  // Replace this with your real tests.
  it('works', function () {
    let result = math(42)
    expect(result).to.be.ok
    expect(result).to.equal(42)
  })

  it('handles arity 1 builtins', function () {
    let result = math(['-', -42])
    expect(result).to.be.ok
    expect(result).to.equal(42)
  })

  it('handles arity 2 builtins', function () {
    let result = math([53, '-', 11])
    expect(result).to.be.ok
    expect(result).to.equal(42)
  })

  it('handles arity 3 builtins', function () {
    let result = math([true, '?', 42, -1])
    expect(result).to.be.ok
    expect(result).to.equal(42)
  })

  it('handles arity 1 Math', function () {
    let result = math(['round', 42.42])
    expect(result).to.be.ok
    expect(result).to.equal(42)
  })

  it('handles arity 2 Math', function () {
    let result = math([42, 'pow', 1])
    expect(result).to.be.ok
    expect(result).to.equal(42)
  })
})

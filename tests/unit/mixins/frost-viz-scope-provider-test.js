/* jshint expr:true */
import { expect } from 'chai'
import {
  describe,
  it
} from 'mocha'
import Ember from 'ember'
import FrostVizScopeProviderMixin from 'ciena-frost-viz/mixins/frost-viz-scope-provider'

describe('FrostVizScopeProviderMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let FrostVizScopeProviderObject = Ember.Object.extend(FrostVizScopeProviderMixin)
    let subject = FrostVizScopeProviderObject.create()
    expect(subject).to.be.ok
  })
})

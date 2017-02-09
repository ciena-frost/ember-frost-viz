/* jshint expr:true */
import {expect} from 'chai'
import hbs from 'htmlbars-inline-precompile'
import {describe, it} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-viz/plot/scatter')
describe(test.label, function () {
  test.setup()

  it.skip('renders', function () {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#frost-viz/plot/scatter}}
    //     template content
    //   {{/frost-viz/plot/scatter}}
    // `);

    this.render(hbs`{{frost-viz/plot/scatter}}`)
    expect(this.$()).to.have.length(1)
  })
})

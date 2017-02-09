/* jshint expr:true */
import {expect} from 'chai'
import hbs from 'htmlbars-inline-precompile'
import {describe, it} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-viz/support/expose')
describe(test.label, function () {
  test.setup()

  it.skip('renders', function () {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#frost-viz/support/expose}}
    //     template content
    //   {{/frost-viz/support/expose}}
    // `);

    this.render(hbs`{{frost-viz/support/expose}}`)
    expect(this.$()).to.have.length(1)
  })
})

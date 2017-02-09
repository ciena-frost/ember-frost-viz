/* jshint expr:true */
import {expect} from 'chai'
import hbs from 'htmlbars-inline-precompile'
import {describe, it} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-viz/transform/cartesian')
describe(test.label, function () {
  test.setup()

  it.skip('renders', function () {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#frost-viz/transform/cartesian}}
    //     template content
    //   {{/frost-viz/transform/cartesian}}
    // `);

    this.render(hbs`{{frost-viz/transform/cartesian}}`)
    expect(this.$()).to.have.length(1)
  })
})

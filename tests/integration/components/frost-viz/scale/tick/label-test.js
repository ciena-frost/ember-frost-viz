/* jshint expr:true */
import {expect} from 'chai'
import hbs from 'htmlbars-inline-precompile'
import {describe, it} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-viz/scale/tick/label')
describe(test.label, function () {
  test.setup()

  it('renders', function () {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#frost-viz/scale/tick/label}}
    //     template content
    //   {{/frost-viz/scale/tick/label}}
    // `);

    this.render(hbs`{{frost-viz/scale/tick/label}}`)
    expect(this.$()).to.have.length(1)
  })
})

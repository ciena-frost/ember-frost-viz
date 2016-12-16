/* jshint expr:true */
import { expect } from 'chai'
import {
  describeComponent,
  it
} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describeComponent(
  'frost-viz/transform/cartesian',
  'Integration: FrostVizTransformCartesianComponent',
  {
    integration: true
  },
  function () {
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
  }
)

/* jshint expr:true */
import { expect } from 'chai'
import {
  describeComponent,
  it
} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describeComponent(
  'frost-viz/plot/line',
  'Integration: FrostVizPlotLineComponent',
  {
    integration: true
  },
  function () {
    it.skip('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#frost-viz/plot/line}}
      //     template content
      //   {{/frost-viz/plot/line}}
      // `);

      this.render(hbs`{{frost-viz/plot/line}}`)
      expect(this.$()).to.have.length(1)
    })
  }
)

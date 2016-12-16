/* jshint expr:true */
import { expect } from 'chai'
import {
  describeComponent,
  it
} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describeComponent(
  'frost-viz/plot/element/symbol/star',
  'Integration: FrostVizPlotElementSymbolStarComponent',
  {
    integration: true
  },
  function () {
    it('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#frost-viz/plot/element/symbol/star}}
      //     template content
      //   {{/frost-viz/plot/element/symbol/star}}
      // `);

      this.render(hbs`{{frost-viz/plot/element/symbol/star}}`)
      expect(this.$()).to.have.length(1)
    })
  }
)

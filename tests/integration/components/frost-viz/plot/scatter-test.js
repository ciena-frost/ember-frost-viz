/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'frost-viz/plot/scatter',
  'Integration: FrostVizPlotScatterComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#frost-viz/plot/scatter}}
      //     template content
      //   {{/frost-viz/plot/scatter}}
      // `);

      this.render(hbs`{{frost-viz/plot/scatter}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);

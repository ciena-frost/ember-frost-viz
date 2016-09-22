/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'frost-viz/scale/tick/label',
  'Integration: FrostVizScaleTickLabelComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#frost-viz/scale/tick/label}}
      //     template content
      //   {{/frost-viz/scale/tick/label}}
      // `);

      this.render(hbs`{{frost-viz/scale/tick/label}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);

/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'frost-viz/support/expose',
  'Integration: FrostVizSupportExposeComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#frost-viz/support/expose}}
      //     template content
      //   {{/frost-viz/support/expose}}
      // `);

      this.render(hbs`{{frost-viz/support/expose}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);

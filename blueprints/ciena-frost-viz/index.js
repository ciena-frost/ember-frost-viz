/*jshint node:true*/
module.exports = {
  description: '',

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-array-helper',  target: '^1.0.0'},
        {name: 'ember-cli-d3-shape',  target: '0.9.4-4.1.1.0'},
        {name: 'ember-frost-core',    target: '>=0.25.6 <1.0.0'},
        {name: 'ember-prop-types',    target: '^3.0.0'},
      ]
    })
  }
};

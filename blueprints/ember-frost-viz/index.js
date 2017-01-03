module.exports = {
  description: '',

  normalizeEntityName: function () {},

  afterInstall: function () {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-array-helper', target: '^1.0.0'},
        {name: 'ember-cli-d3-shape', target: '0.9.4-4.1.1.0'},
        {name: 'ember-frost-core', target: '1.3.6'},
        {name: 'ember-prop-types', target: '3.2.1'}
      ]
    })
  }
}

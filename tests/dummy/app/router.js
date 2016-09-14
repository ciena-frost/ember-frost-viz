import Ember from 'ember'
import config from './config/environment'

const Router = Ember.Router.extend({
  location: config.locationType
})

Router.map(function () {
  this.route('demo', { path: '/' }, function () {
    this.route('overview', { path: '/' })
    this.route('scatter')
    this.route('line')
    this.route('interaction')
    this.route('dynamic-domains')
    this.route('reference');
  })
})

export default Router

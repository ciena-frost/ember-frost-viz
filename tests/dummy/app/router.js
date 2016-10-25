import Ember from 'ember'
import config from './config/environment'

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function () {
  this.route('demo', { path: '/' }, function () {
    this.route('overview', { path: '/' })
    this.route('scatter')
    this.route('line')
    this.route('bar')
    this.route('interaction')
    this.route('dynamic-domains')
    this.route('reference')
    this.route('sandbox')
  })
})

export default Router

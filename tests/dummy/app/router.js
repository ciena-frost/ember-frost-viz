import Ember from 'ember'
const {Router: EmberRouter} = Ember
import config from './config/environment'

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function () {
  this.route('demo', {path: '/'}, function () {
    this.route('overview', {path: '/'})
    this.route('scatter')
    this.route('line')
    this.route('bar')
    this.route('interaction')
    this.route('dynamic-domains')
    this.route('reference')
  })
})

export default Router

import config from './config/environment'
import Ember from 'ember'
const {Application} = Ember
import Resolver from './resolver'
import loadInitializers from 'ember-load-initializers'

let App

Ember.MODEL_FACTORY_INJECTIONS = true

App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
})

loadInitializers(App, config.modulePrefix)

export default App

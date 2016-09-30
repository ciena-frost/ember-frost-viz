import Ember from 'ember'

export default Ember.Route.extend({
  dataGenerator: Ember.inject.service(),
  model () {
    return this.get('dataGenerator').createScatter(1).addIntervals(40)
  }
})

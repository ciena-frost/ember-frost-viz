import Ember from 'ember'
const {Route, inject} = Ember

export default Route.extend({
  dataGenerator: inject.service(),
  model () {
    return this.get('dataGenerator').createScatter(1).addIntervals(15)
  }
})

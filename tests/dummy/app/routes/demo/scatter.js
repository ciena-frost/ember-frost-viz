import Ember from 'ember'
const {Route, get, inject, run, set} = Ember

export default Route.extend({
  dataGenerator: inject.service(),
  model () {
    const clock = Ember.Object.create({
      interval: 0
    })
    const update = function () {
      run.later(function () {
        set(clock, 'interval', get(clock, 'interval') + 1)
        update()
      }, 1000 / 60)
    }
    update()
    return Ember.Object.create({
      data: this.get('dataGenerator').createScatter(1).addIntervals(40),
      clock
    })
  }
})

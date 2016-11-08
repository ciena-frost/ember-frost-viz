import Ember from 'ember'

export default Ember.Route.extend({
  dataGenerator: Ember.inject.service(),
  model () {
    const clock = Ember.Object.create({
      interval: 0
    })
    const update = function () {
      Ember.run.later(function () {
        Ember.set(clock, 'interval', Ember.get(clock, 'interval') + 1)
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

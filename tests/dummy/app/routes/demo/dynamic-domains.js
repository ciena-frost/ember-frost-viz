import Ember from 'ember';

export default Ember.Route.extend({
  dataGenerator: Ember.inject.service(),
  model() {
    const scatter = this.get('dataGenerator').createScatter(1);
    const modelData = scatter.addIntervals(40)
    this.set('modelData', modelData);
    const updateData = function() {
      Ember.run.later(function() {
        console.log('updating data')
        modelData.removeAt(0, 1)
        scatter.addInterval()
        updateData()
      }, 1000)
    }
    updateData();
    return modelData;
  }
});

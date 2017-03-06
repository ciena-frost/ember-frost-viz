import Ember from 'ember'
const {A, Route, inject, run} = Ember

export default Route.extend({
  dataGenerator: inject.service(),
  model () {
    const scatter1 = this.get('dataGenerator').createScatter(1)
    const scatter2 = this.get('dataGenerator').createScatter(1)
    const modelData1 = scatter1.addIntervals(40)
    const modelData2 = scatter2.addIntervals(40)
    const modelData = A([])
    const updateData = function () {
      run.later(function () {
        modelData.removeAt(0, 1)
        scatter1.addInterval()
        scatter2.addInterval()
        modelData.addObject([modelData1[modelData1.length - 1], modelData2[modelData2.length - 1]])
        updateData()
      }, 1000)
    }
    for (let i = 0; i < modelData1.length; ++i) {
      modelData.addObject([modelData1[i], modelData2[i]])
    }
    this.set('modelData', modelData)
    updateData()
    return modelData
  }
})

import Ember from 'ember'
const {Mixin} = Ember

export default Mixin.create({
  formatter: null,
  formatterArgs: null,
  compute (params /*, hash */) {
    if (params) this.set('formatterArgs', params)
    const formatter = this.get('formatter')
    return formatter(this.get('formatterArgs'))
  }
})

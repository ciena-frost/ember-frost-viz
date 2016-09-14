import Ember from 'ember'
import { NumericFormatterBase } from './numeric'

export default Ember.Helper.extend(NumericFormatterBase, {
  formatterArgs: '.3',
  compute () {
    // Don't allow reconfiguration of the default formatter.
    return this._super()
  }
})

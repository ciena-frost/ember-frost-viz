import Ember from 'ember'
const {Helper} = Ember
import {NumericFormatterBase} from './numeric'

export default Helper.extend(NumericFormatterBase, {
  formatterArgs: '.3',
  compute () {
    // Don't allow reconfiguration of the default formatter.
    return this._super()
  }
})

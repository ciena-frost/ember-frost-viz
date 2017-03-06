import {format} from 'd3-format'
import Ember from 'ember'
const {Helper, Mixin} = Ember
import FormatterBase from 'ember-frost-viz/mixins/frost-viz-format'

const NumericFormatterBase = Mixin.create(FormatterBase, {
  formatterArgs: '.3',
  formatter: format
})

export default Helper.extend(NumericFormatterBase)
export {NumericFormatterBase}

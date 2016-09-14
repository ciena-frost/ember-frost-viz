import Ember from 'ember'
import FormatterBase from 'ember-frost-viz/mixins/frost-viz-format'
import { format } from 'd3-format'

const NumericFormatterBase = Ember.Mixin.create(FormatterBase, {
  formatterArgs: '.3',
  formatter: format
})

export default Ember.Helper.extend(NumericFormatterBase)
export { NumericFormatterBase }

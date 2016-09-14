import Ember from 'ember'
import layout from '../../templates/components/frost-viz/chart'
import { PropTypes } from 'ember-prop-types'
import DOMBox from 'ember-frost-viz/mixins/frost-viz-dom-box'
import Area from 'ember-frost-viz/mixins/frost-viz-area'
import Rectangle from 'ember-frost-viz/utils/frost-viz-rectangle'
import { bindFunctionMap } from 'ember-frost-viz/utils/frost-viz-data-transform'
import DimensionManager from 'ember-frost-viz/mixins/frost-viz-dimension-manager'

const Chart = Ember.Component.extend(DOMBox, Area, DimensionManager, {
  layout,
  tagName: 'svg',
  classNames: ['frost-viz-chart'],

  propTypes: {
    data: PropTypes.array.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    selectedElement: PropTypes.any
  },
  getDefaultProps () {
    return {
    }
  },

  // innerArea (provided by Mixin:Area) will be based on these properties.
  // If not set, they are provided by box (provided by Mixin:DOMBox).
  // If set, we ignore box.
  width: Ember.computed.oneWay('box.width'),
  height: Ember.computed.oneWay('box.height'),
  // No need to set area -- the innerArea.parent of this will be undefined.

  actions: {
    // TODO: more fine grained interaction types here
    setSelection (id, element) {
      this.set('selectedElement', element)
      this.set('_selectedId', id)
    },
    clearSelection (id) {
      const _selectedId = this.get('_selectedId')
      if (id === _selectedId) {
        this.set('selectedElement', null)
      }
    }
  },

  clearSelectionId: Ember.observer('selectedElement', function () {
    this.set('_selectedId', null)
  }),

  interaction: Ember.computed('selectedElement', function () {
    const selectedElement = this.get('selectedElement')
    return {
      selectedElement
    }
  }),

  chartScope: Ember.computed('data', 'data.[]', 'innerArea', 'interaction', function () {
    const data = this.get('data')
    const chartArea = Rectangle.from(this.get('innerArea'))
    const interaction = this.get('interaction')
    const actions = bindFunctionMap(this.get('actions'), this) // pass all actions as bound functions
    return {
      data, chartArea, interaction, actions
    }
  })

})

Chart.reopenClass({
  positionalParams: ['data']
})

export default Chart

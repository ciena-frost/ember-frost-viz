import Ember from 'ember'
import layout from '../../templates/components/frost-viz/chart'
import { PropTypes } from 'ember-prop-types'
import DOMBox from 'ciena-frost-viz/mixins/frost-viz-dom-box'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import DimensionManager from 'ciena-frost-viz/mixins/frost-viz-dimension-manager'
import ScopeProvider from 'ciena-frost-viz/mixins/frost-viz-scope-provider'

const Chart = Ember.Component.extend(DOMBox, Area, DimensionManager, ScopeProvider, {
  layout,
  tagName: 'svg',
  classNames: ['frost-viz-chart'],
  attributeBindings: ['width', 'height'],

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

  callbacks: {
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

  childScope: Ember.computed('childScopeBase', 'interaction', function () {
    const interaction = this.get('interaction')
    return Object.assign({}, this.get('childScopeBase'), { interaction })
  })

})

Chart.reopenClass({
  positionalParams: ['data']
})

export default Chart

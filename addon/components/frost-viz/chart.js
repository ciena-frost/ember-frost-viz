import Ember from 'ember'
import layout from '../../templates/components/frost-viz/chart'
import { PropTypes } from 'ember-prop-types'
import DOMBox from 'ciena-frost-viz/mixins/frost-viz-dom-box'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import DimensionManager from 'ciena-frost-viz/mixins/frost-viz-dimension-manager'
import ScopeProvider from 'ciena-frost-viz/mixins/frost-viz-scope-provider'

const ChartScope = Ember.Object.extend()

const Chart = Ember.Component.extend(DOMBox, Area, DimensionManager, ScopeProvider, {
  layout,
  tagName: 'svg',
  classNames: ['frost-viz-chart'],
  attributeBindings: ['width', 'height'],

  propTypes: {
    data: PropTypes.array.isRequired,
    dimensions: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.EmberObject
    ]),
    width: PropTypes.number,
    height: PropTypes.number
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
  },

  childScope: Ember.computed('childScopeBase', function () {
    const dimensions = this.get('dimensions')
    return ChartScope.create(this.get('childScopeBase'), { dimensions })
  })

})

Chart.reopenClass({
  positionalParams: ['data']
})

export default Chart

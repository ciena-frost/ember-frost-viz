import Ember from 'ember'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import PropTypesMixin, {PropTypes} from 'ember-prop-types'
// import Rectangle from 'ciena-frost-viz/utils/frost-viz-rectangle'
// import {ChartScope} from 'ciena-frost-viz/utils/chart-scope'
import ScopeProvider from 'ciena-frost-viz/mixins/frost-viz-scope-provider'

const TransformScope = Ember.Object.extend(PropTypesMixin, {
  propTypes: {
    actions: PropTypes.arrayOf(PropTypes.func),
    // scope: PropTypes.instanceOf(ChartScope),
    scope: PropTypes.object,
    transformArea: PropTypes.EmberObject
  }
})

export default Ember.Mixin.create(Area, ScopeProvider, {
  tagName: 'g',
  classNames: ['frost-viz-transform'],
  dimensions: null,

  // The width and height derive from the scope area unless overridden
  area: Ember.computed.oneWay('scope.area'),
  data: Ember.computed.alias('scope.data'),
  width: Ember.computed.oneWay('area.width'),
  height: Ember.computed.oneWay('area.height'),

  childScope: Ember.computed('dimensions', 'childScopeBase', function () {
    const dimensions = Object.assign({}, this.get('scope.dimensions'), this.get('dimensions'))
    const result = TransformScope.create(this.get('childScopeBase'), { dimensions })
    // console.log('transform scope:', result)
    return result
  })

})

export {TransformScope}

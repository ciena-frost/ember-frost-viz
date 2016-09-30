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

  // The width and height derive from the scope area unless overridden
  area: Ember.computed.oneWay('scope.area'),
  data: Ember.computed.alias('scope.data'),
  width: Ember.computed.oneWay('area.width'),
  height: Ember.computed.oneWay('area.height'),

  childScope: Ember.computed('dataBindings', 'childScopeBase', 'coordinateTransforms', function () {
    const dataBindings = Object.assign({}, this.get('scope.dataBindings'), this.get('dataBindings'))
    const coordinateTransforms = this.get('coordinateTransforms')
    const result = TransformScope.create(this.get('childScopeBase'), { dataBindings, coordinateTransforms })
    // console.log('transform scope:', result)
    return result
  })

})

export {TransformScope}

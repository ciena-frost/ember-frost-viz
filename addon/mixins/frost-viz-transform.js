import Ember from 'ember'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import PropTypesMixin, {PropTypes} from 'ember-prop-types'
// import Rectangle from 'ciena-frost-viz/utils/frost-viz-rectangle'
// import {ChartScope} from 'ciena-frost-viz/utils/chart-scope'
import ScopeProvider from 'ciena-frost-viz/mixins/frost-viz-scope-provider'

const TransformScope = Ember.Object.extend(PropTypesMixin, {
  propTypes: {
    data: PropTypes.array
    // area: PropTypes.EmberObject, // TODO: Rectangle
  }
})

export default Ember.Mixin.create(Area, ScopeProvider, {
  tagName: 'g',
  classNames: ['frost-viz-transform'],

  propTypes: {
    width: PropTypes.number,
    height: PropTypes.number
    // dataBindings: PropTypes.oneOf([ // TODO: warns every refresh
    //   PropTypes.object,
    //   PropTypes.EmberObject
    // ]),
    // scope: PropTypes.oneOf([ // TODO: positional, present, warns anyway
    //   PropTypes.object,
    //   PropTypes.EmberObject
    // ]).isRequired
  },
  getDefaultProps () {
    return {}
  },

  data: Ember.computed.alias('scope.data'),

  // The width and height derive from the scope area unless overridden
  area: Ember.computed.oneWay('scope.area'),
  width: Ember.computed.oneWay('area.width'),
  height: Ember.computed.oneWay('area.height'),

  childScope: Ember.computed('childScopeBase', 'dataBindings', 'coordinateTransforms', function () {
    const dataBindings = Object.assign({}, this.get('scope.dataBindings'), this.get('dataBindings'))
    const coordinateTransforms = this.get('coordinateTransforms')
    const result = TransformScope.create(this.get('childScopeBase'), { dataBindings, coordinateTransforms })
    return result
  })

})

export {TransformScope}

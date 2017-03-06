import Ember from 'ember'
const {Mixin, computed} = Ember
import Area from 'ember-frost-viz/mixins/frost-viz-area'
import ScopeProvider from 'ember-frost-viz/mixins/frost-viz-scope-provider'
import PropTypesMixin, {PropTypes} from 'ember-prop-types'
// import Rectangle from 'ember-frost-viz/utils/frost-viz-rectangle'
// import {ChartScope} from 'ember-frost-viz/utils/chart-scope'

const TransformScope = Ember.Object.extend(PropTypesMixin, {
  propTypes: {
    data: PropTypes.array
    // area: PropTypes.EmberObject, // TODO: Rectangle
  }
})

export default Mixin.create(Area, ScopeProvider, {
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

  data: computed.alias('scope.data'),

  // The width and height derive from the scope area unless overridden
  area: computed.oneWay('scope.area'),
  width: computed.oneWay('area.width'),
  height: computed.oneWay('area.height'),

  childScope: computed('childScopeBase', 'dataBindings', 'coordinateTransforms', function () {
    const dataBindings = Object.assign({}, this.get('scope.dataBindings'), this.get('dataBindings'))
    const coordinateTransforms = this.get('coordinateTransforms')
    const result = TransformScope.create(this.get('childScopeBase'), {dataBindings, coordinateTransforms})
    return result
  })

})

export {TransformScope}

import Ember from 'ember'
import Area from 'ciena-frost-viz/mixins/frost-viz-area'
import PropTypesMixin, {PropTypes} from 'ember-prop-types'
// import Rectangle from 'ciena-frost-viz/utils/frost-viz-rectangle'
// import {ChartScope} from 'ciena-frost-viz/utils/chart-scope'

const TransformScope = Ember.Object.extend(PropTypesMixin, {
  propTypes: {
    actions: PropTypes.arrayOf(PropTypes.func),
    // chart: PropTypes.instanceOf(ChartScope),
    chart: PropTypes.object,
    transformArea: PropTypes.EmberObject
  }
})

export default Ember.Mixin.create(Area, {
  tagName: 'g',
  classNames: ['frost-viz-transform'],
  dimensions: null,

  // The Area mixin produces innerArea from area, width and height.
  area: Ember.computed.alias('chart.chartArea'),
  // The width and height derive from the chartArea unless overridden
  width: Ember.computed.oneWay('chart.chartArea.width'),
  height: Ember.computed.oneWay('chart.chartArea.height'),

  transformScope: Ember.computed('innerArea', 'chart.actions', 'dimensions', function () {
    const transformActions = { updateMargins: this.get('actions.updateMargins').bind(this) }
    const actions = Object.assign({}, this.get('chart.actions'), transformActions)

    const chart = this.get('chart')
    const dimensions = Object.assign({}, this.get('chart.dimensions'), this.get('dimensions'))
    const transformArea = this.get('innerArea')
    return TransformScope.create(Object.assign({}, chart, { actions, dimensions, transformArea }))
  })

})

export {TransformScope}

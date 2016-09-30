import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/plot/bar'
import ElementBuilder from 'ciena-frost-viz/mixins/frost-viz-element-builder'
import Rectangle from 'ciena-frost-viz/utils/frost-viz-rectangle'

const Bar = Ember.Component.extend(ElementBuilder, {
  layout,
  classNames: ['frost-viz-plot-bar'],

  plotBars: undefined,

  align: 'bottom',

  mapFunctions: Ember.Object.create({
    left: function (area) {
      return function (el) {
        return Object.assign(el, {x: 0, y: el.y - 10, width: el.x, height: 20})
      }
    },
    bottom: function (area) {
      const bottom = area.get('bottom')
      return function (el) {
        return Object.assign(el, {x: el.x - 10, y: el.y, width: 20, height: bottom - el.y})
      }
    }
  }),

  bars: Ember.computed('elements', 'align', function () {
    const transformArea = Rectangle.from(this.get('scope.area'))
    const align = this.get('align')
    const mapFunctions = this.get('mapFunctions')
    const alignFunction = mapFunctions.get(align)(transformArea)
    return this.get('elements').map(alignFunction)
  })
})

Bar.reopenClass({
  positionalParams: ['scope']
})

export default Bar

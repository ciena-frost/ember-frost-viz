import {path} from 'd3-path'
import curves from 'd3-shape'
import Ember from 'ember'
const {A, Component, computed} = Ember
const {camelize} = Ember.String
import layout from '../../../templates/components/frost-viz/plot/path'
import Plotter from 'ember-frost-viz/mixins/frost-viz-plotter'

const Path = Component.extend(Plotter, {
  layout,
  classNames: ['frost-viz-plot-path'],
  smooth: 'basis',

  path: computed('data', 'elements', 'elementGenerate', 'smooth', function () {
    const elements = this.get('elements')
    const smooth = this.get('smooth')
    if (!elements) return A([])
    const myPath = path()
    const smoothName = camelize(`curve-${smooth}`)
    const basis = curves[smoothName](myPath)
    basis.lineStart()
    for (let element of elements) {
      basis.point(element.x, element.y)
    }
    basis.lineEnd()
    return myPath.toString()
  })
})

Path.reopenClass({
  positionalParams: ['scope']
})

export default Path

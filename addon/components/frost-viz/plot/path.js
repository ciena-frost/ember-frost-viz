import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/plot/path'
import ElementBuilder from 'ciena-frost-viz/mixins/frost-viz-element-builder'
import { path } from 'd3-path'
import curves from 'd3-shape'

const Path = Ember.Component.extend(ElementBuilder, {
  layout,
  classNames: ['frost-viz-plot-path'],
  smooth: 'basis',

  path: Ember.computed('data', 'elements', 'elementGenerate', 'smooth', function () {
    const elements = this.get('elements')
    const smooth = this.get('smooth')
    if (!elements) return Ember.A([])
    const myPath = path()
    const smoothName = Ember.String.camelize(`curve-${smooth}`)
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

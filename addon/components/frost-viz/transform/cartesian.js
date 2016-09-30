import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/transform'
import FrostVizTransform from 'ciena-frost-viz/mixins/frost-viz-transform'

const Transform = Ember.Component.extend(FrostVizTransform, {
  layout,

  coordinateTransforms (area) {
    return {
      x: (value) => area.width * value,
      y: (value) => area.height * (1.0 - value)
    }
  }
})

Transform.reopenClass({
  positionalParams: ['scope']
})

export default Transform

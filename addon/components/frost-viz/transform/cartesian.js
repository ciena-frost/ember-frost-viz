import Ember from 'ember'
import layout from '../../../templates/components/frost-viz/transform/cartesian'
import FrostVizTransform from 'ciena-frost-viz/mixins/frost-viz-transform'

const Transform = Ember.Component.extend(FrostVizTransform, {
  layout
})

Transform.reopenClass({
  positionalParams: ['chart']
})

export default Transform

import Ember from 'ember'
import { mapObj } from 'ember-frost-viz/utils/frost-viz-data-transform'

export default Ember.Mixin.create({
  actions: {
    updateMargins (key, margins) {
      // console.log('Updating margins', key, margins)
      let marginsByAlignment = this.get('marginsByAlignment')
      if (!marginsByAlignment) {
        marginsByAlignment = this.set('marginsByAlignment', {})
      }
      Ember.set(marginsByAlignment, key, margins)
      Ember.run.once(this, this.recalculateInnerArea)
    }
  },

  recalculateInnerArea () {
    const margin = this.getWithDefault('margin', {})
    const maxima = {top: 0, right: 0, left: 0, bottom: 0}
    mapObj(this.get('marginsByAlignment'), function (key, value) {
      for (let key in value) {
        maxima[key] = Math.max(maxima[key], value[key] || 0)
      }
    })
    for (let key in maxima) {
      Ember.set(margin, key, maxima[key])
    }
    // console.log('Setting unified plot margins', margin)
    this.set('margin', margin)
  },

  innerArea: Ember.computed('width', 'height', 'margin.{left,right,top,bottom}', function () {
    const width = this.get('width') || 0
    const height = this.get('height') || 0
    const left = this.get('margin.left') || 0
    const right = this.get('margin.right') || 0
    const top = this.get('margin.top') || 0
    const bottom = this.get('margin.bottom') || 0
    const innerArea = {
      x: left,
      y: top,
      width: Math.max(width - left - right, 0),
      height: Math.max(height - top - bottom, 0),
      parent: this.get('area')
    }
    console.log('new innerArea', innerArea)
    return innerArea
  })

})

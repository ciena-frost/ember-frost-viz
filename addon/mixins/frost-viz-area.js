import Ember from 'ember'
import { mapObj } from 'ember-frost-viz/utils/frost-viz-data-transform'

export default Ember.Mixin.create({
  callbacks: {
    updatePadding (key, padding) {
      let paddingByAlignment = this.get('paddingByAlignment')
      if (!paddingByAlignment) {
        paddingByAlignment = this.set('paddingByAlignment', {})
      }
      Ember.set(paddingByAlignment, key, padding)
      Ember.run.once(this, this.recalculatePadding)
    }
  },

  recalculatePadding () {
    const padding = this.getWithDefault('padding', {})
    const maxima = {top: 0, right: 0, left: 0, bottom: 0}
    mapObj(this.get('paddingByAlignment'), (key, value) => {
      for (let key in value) {
        maxima[key] = Math.max(maxima[key], value[key] || 0)
      }
    })
    for (let key in maxima) {
      Ember.set(padding, key, maxima[key])
    }
    this.set('padding', padding)
  },

  /* eslint-disable complexity */
  innerArea: Ember.computed('width', 'height', 'padding.{left,right,top,bottom}', function () {
    const width = this.get('width') || 0
    const height = this.get('height') || 0
    const left = this.get('padding.left') || 0
    const right = this.get('padding.right') || 0
    const top = this.get('padding.top') || 0
    const bottom = this.get('padding.bottom') || 0
    const innerArea = {
      x: left,
      y: top,
      width: Math.max(width - left - right, 0),
      height: Math.max(height - top - bottom, 0),
      parent: this.get('area')
    }
    return innerArea
  })
  /* eslint-enable complexity */

})

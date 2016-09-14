import Ember from 'ember'

export const MarginDefaults = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
}

export const RectangleDefaults = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

export const Rectangle = Ember.Object.extend(RectangleDefaults, {
  x: 0,
  y: 0,
  width: 0,
  height: 0,

  left: Ember.computed.alias('x'),
  top: Ember.computed.alias('y'),

  right: Ember.computed({
    get () {
      return this.get('x') + this.get('width')
    },
    set (_, value) {
      this.set('width', value - this.get('x'))
      return value
    }
  }),
  bottom: Ember.computed({
    get () {
      return this.get('y') + this.get('height')
    },
    set (_, value) {
      this.set('height', value - this.get('y'))
      return value
    }
  }),

  edges: Ember.computed(function () {
    const edges = this.getProperties(['left', 'right', 'top', 'bottom'])
    return edges
  }),

  intersectWith (r2) {
    return Rectangle.intersect(this, r2)
  },

  unionWith (r2) {
    return Rectangle.union(this, r2)
  },

  expandBy (margins) {
    return Rectangle.expand(this, margins)
  },

  contractBy (margins) {
    return Rectangle.contract(this, margins)
  },

  moveTo(x, y) {
    const result = Rectangle.from(this)
    result.set('x', x)
    result.set('y', y)
    return result
  },

  translate (x, y) {
    const result = Rectangle.from(this)
    result.set('left', result.get('left') + x)
    result.set('top', result.get('top') + y)
    return result
  }
})

Rectangle.reopenClass({
  from (object) {
    const x = Ember.get(object, 'x') || 0
    const y = Ember.get(object, 'y') || 0
    const width = Ember.get(object, 'width') || 0
    const height = Ember.get(object, 'height') || 0
    return Rectangle.create({x, y, width, height})
  },

  contract (r1, margins) {
    const { left, right, top, bottom } = Object.assign({}, MarginDefaults, margins)
    return Rectangle.expand(r1, { left: -left, right: -right, top: -top, bottom: -bottom })
  },

  expand (r1, margins) {
    const { x, y, width, height } = Object.assign({}, RectangleDefaults, r1)
    const { left, right, top, bottom } = Object.assign({}, MarginDefaults, margins)
    return Rectangle.create({
      x: x - left,
      y: y - top,
      width: width + left + right,
      height: height + top + bottom
    })
  },

  intersect (ra1, ra2) {
    const r1 = Rectangle.create(ra1)
    const r2 = Rectangle.create(ra2)
    const x = Math.max(Ember.get(r1, 'x'), Ember.get(r2, 'x'))
    const y = Math.max(Ember.get(r1, 'y'), Ember.get(r2, 'y'))
    const x2 = Math.min(Ember.get(r1, 'right'), Ember.get(r2, 'right'))
    const y2 = Math.min(Ember.get(r1, 'bottom'), Ember.get(r2, 'bottom'))
    return Rectangle.create({ x, y, width: x2 - x, height: y2 - y })
  },

  union (ra1, ra2) {
    const r1 = Object.assign({}, RectangleDefaults, ra1)
    const r2 = Object.assign({}, RectangleDefaults, ra2)
    const x = Math.min(Ember.get(r1, 'x'), Ember.get(r2, 'x'))
    const y = Math.min(Ember.get(r1, 'y'), Ember.get(r2, 'y'))
    const x2 = Math.max(Ember.get(r1, 'right'), Ember.get(r2, 'right'))
    const y2 = Math.max(Ember.get(r1, 'bottom'), Ember.get(r2, 'bottom'))
    return Rectangle.create({ x, y, width: x2 - x, height: y2 - y })
  }

})

export default Rectangle

import Ember from 'ember'
const {computed, get} = Ember

export const PaddingDefaults = {
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

  left: computed.alias('x'),
  top: computed.alias('y'),

  right: computed({
    get () {
      return this.get('x') + this.get('width')
    },
    set (_, value) {
      this.set('width', value - this.get('x'))
      return value
    }
  }),
  bottom: computed({
    get () {
      return this.get('y') + this.get('height')
    },
    set (_, value) {
      this.set('height', value - this.get('y'))
      return value
    }
  }),

  edges: computed(function () {
    const edges = this.getProperties(['left', 'right', 'top', 'bottom'])
    return edges
  }),

  area: computed('width', 'height', function () {
    return (this.get('width') || 0) * (this.get('height' || 0))
  }),

  intersectWith (r2) {
    return Rectangle.intersect(this, r2)
  },

  unionWith (r2) {
    return Rectangle.union(this, r2)
  },

  expandBy (padding) {
    return Rectangle.expand(this, padding)
  },

  contractBy (padding) {
    return Rectangle.contract(this, padding)
  },

  moveTo (x, y) {
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
    const x = get(object, 'x') || 0
    const y = get(object, 'y') || 0
    const width = get(object, 'width') || 0
    const height = get(object, 'height') || 0
    return Rectangle.create({x, y, width, height})
  },

  contract (r1, padding) {
    // eslint-disable-next-line ocd/sort-variable-declarator-properties
    const {left, right, top, bottom} = Object.assign({}, PaddingDefaults, padding)
    return Rectangle.expand(r1, {left: -left, right: -right, top: -top, bottom: -bottom})
  },

  expand (r1, padding) {
    // eslint-disable-next-line ocd/sort-variable-declarator-properties
    const {x, y, width, height} = Object.assign({}, RectangleDefaults, r1)
    // eslint-disable-next-line ocd/sort-variable-declarator-properties
    const {left, right, top, bottom} = Object.assign({}, PaddingDefaults, padding)
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
    const x = Math.max(get(r1, 'x'), get(r2, 'x'))
    const y = Math.max(get(r1, 'y'), get(r2, 'y'))
    const x2 = Math.min(get(r1, 'right'), get(r2, 'right'))
    const y2 = Math.min(get(r1, 'bottom'), get(r2, 'bottom'))
    return Rectangle.create({x, y, width: x2 - x, height: y2 - y})
  },

  union (ra1, ra2) {
    const r1 = Object.assign({}, RectangleDefaults, ra1)
    const r2 = Object.assign({}, RectangleDefaults, ra2)
    const x = Math.min(get(r1, 'x'), get(r2, 'x'))
    const y = Math.min(get(r1, 'y'), get(r2, 'y'))
    const x2 = Math.max(get(r1, 'right'), get(r2, 'right'))
    const y2 = Math.max(get(r1, 'bottom'), get(r2, 'bottom'))
    return Rectangle.create({x, y, width: x2 - x, height: y2 - y})
  }

})

export default Rectangle

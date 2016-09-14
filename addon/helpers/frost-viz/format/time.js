import Ember from 'ember'
import { timeFormat } from 'd3-time-format'

// If the key was recognized, return that named formatter.
// If the key was unrecognized, treat the key as a format string and
// return that formatter.
const TEMPLATES = Ember.Object.create({
  'default': timeFormat('%H:%M'),
  iso8601: timeFormat('%Y-%m-%dT%H:%M:%S.%LZ'),

  unknownProperty: function (key) {
    return timeFormat(key)
  }
})

export default Ember.Helper.extend({
  compute (params /*, hash */) {
    // If the key is unspecified, use the default format.
    // If the key specified, use that format.
    const templateKey = params
      ? params.shift
        ? params.join(' ')
        : params
      : 'default'
    return TEMPLATES.get(templateKey)
  }
})

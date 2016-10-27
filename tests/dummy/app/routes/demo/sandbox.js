import Ember from 'ember'
import {randomGaussian} from '../../utils/random-lib'

const DATE_BASELINE = (function () {
  const d = new Date()
  d.setDate(d.getDate() - 2)
  return d
})()

function dateOffset (hours) {
  const d = new Date(DATE_BASELINE)
  d.setHours(d.getHours() + hours)
  return d
}

function randomRange (a, b) {
  const max = Math.max(a, b)
  const min = Math.min(a, b)
  return Math.random() * (max - min) + min
}

function simulateFit () {
  const interceptHours = Math.round(randomRange(25, 40))
  const scale = randomRange(1, 5)
  const lineAt = function (m, b) { return (x) => scale * (m * x + b) }

  const initial = randomRange(-10, 10)
  const slope = randomRange(0.1, 1) * (randomRange(-1, 1) < 0 ? -1 : 1)
  const valueAt = lineAt(slope, initial)

  const minInitial = randomRange(initial - scale, initial)
  const minSlope = randomRange(slope, slope - 0.1)
  const minAt = lineAt(minSlope, minInitial)

  const maxInitial = randomRange(initial, initial + scale)
  const maxSlope = randomRange(slope, slope + 0.1)
  const maxAt = lineAt(maxSlope, maxInitial)

  const critical = (slope < 0 ? minAt : maxAt)(interceptHours)
  // console.log('intercept', interceptHours)

  const fitElement = function (hour, observed) {
    const value = observed
      ? { value: randomRange(valueAt(hour) - scale, valueAt(hour) + scale) }
      : {}
    return Object.assign({
      time: dateOffset(hour),
      max: maxAt(hour),
      center: valueAt(hour),
      min: minAt(hour),
      critical,
      source: observed ? 'observed' : 'projected'
    }, value)
  }

  const values = []
  for (let hour = 0; hour < 50; ++hour) {
    const value = fitElement(hour, hour <= 20)
    if (hour === interceptHours) {
      Object.assign(value, {value: critical})
    }
    values.push(value)
  }
  return values
}

// gaussian blur kernel, sigma = 1.0, size = 7
// http://dev.theomader.com/gaussian-kernel-calculator/
const KERNEL = [0.383103,	0.241843,	0.060626,	0.00598]
const SMOOTH_WIDTH = KERNEL.length

const SAMPLE_COUNT = 10
const SAMPLE_WEIGHT = 0.027

function simulateKDE () {
  const bins = {}
  for (let i = 0; i < SAMPLE_COUNT; ++i) {
    const raw = randomGaussian(0, 2)
    const dithered = Math.round(raw * 5) / 5
    bins[dithered] = (bins[dithered] || 0) + SAMPLE_WEIGHT
  }
  const keys = Object.keys(bins)
  const result = []
  for (let key of keys) {
    const x = Number(key)
    result.push({
      x,
      histogram: {x, y: bins[key]},
      pdf: {x, y: bins[key]}
    })
  }
  result.sort((a, b) => a.histogram.x - b.histogram.x)
  for (let i = SMOOTH_WIDTH, n = result.length - SMOOTH_WIDTH; i < n; ++i) {
    result[i].pdf.y *= KERNEL[0]
    for (let j = 1; j < SMOOTH_WIDTH; ++j) {
      let f = KERNEL[j]
      result[i].pdf.y += result[i + j].pdf.y * f
      result[i].pdf.y += result[i - j].pdf.y * f
    }
  }
  const likelihoodDirection = randomRange(-1, 1) < 0 ? -1 : 1
  const likelihoodSpan = Math.round(randomRange(1, 1 + result.length * 0.1))
  const startIndex = likelihoodDirection < 0 ? result.length : 0
  const likelihoodIndex = startIndex + likelihoodDirection * likelihoodSpan
  // console.log(likelihoodIndex)
  result[likelihoodIndex].pdf.likelihood = true
  console.log(result)
  //

  // delete every second smoothed value to test sparse values
  for (let i = 1, n = result.length; i < n; i += 2) {
    delete result[i].pdf
  }
  console.log(result)

  return result
}

function createROCValues () {
  const corner = [0.05, 0.79]
  const cornerC1 = [0.01, 0.5]
  const cornerC2 = [0.2, 0.875]
  return [
    {x: 0, line: 0, curve: 0},
    {x: cornerC1[0], line: cornerC1[0], curve: cornerC1[1]},
    {x: corner[0], line: corner[0], curve: corner[1], selected: true},
    {x: cornerC2[0], line: cornerC2[0], curve: cornerC2[1]},
    {x: 1, line: 1, curve: 1}
  ]
}

export default Ember.Route.extend({
  model () {
    const result = Ember.Object.create({
      kde: simulateKDE(),
      roc: createROCValues(),
      fit: simulateFit(),
      active: 'kde'
    })
    console.log('data ready')
    return result
  }
})

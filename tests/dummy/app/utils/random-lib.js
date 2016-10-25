import Ember from 'ember'

export function randomBoxMuller () {
  const u = 1 - Math.random() // Subtraction to flip [0, 1) to (0, 1].
  const v = 1 - Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

export function randomGaussian (mean, variance) {
  return variance * randomBoxMuller() + mean
}

export const GaussianGenerator = Ember.Object.extend({
  mean: () => 0,
  variance: () => 1,
  generate: function () {
    return randomGaussian(this.mean(), this.variance())
  }
})

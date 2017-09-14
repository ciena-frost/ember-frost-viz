module.exports = {
  coverageEnvVar: 'COVERAGE',
  excludes: [
    '*/tests/**/*'
  ],
  useBabelInstrumenter: true,
  reporters: [
    'html',
    'lcov',
    'text-summary'
  ]
}

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => ({
  entry: './src/app.ts',
  output: {
    path: __dirname + '/public',
    filename: 'build/bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: argv.mode === 'production' ? [] : [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../database',
          to: 'database'
        }
      ]
    })
  ]
})

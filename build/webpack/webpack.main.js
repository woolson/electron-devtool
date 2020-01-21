const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

let config = {
  mode: isDev ? 'development' : 'production',
  entry: './main/index.js',
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
    ]
  }
}

module.exports = config
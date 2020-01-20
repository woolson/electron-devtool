const path = require('path')
const merge = require('webpack-merge')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  mode: isDev ? 'development' : 'production',
  entry: './render/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'render.js',
  },
  module: {
    rules: [
      {
        test: /\.vue?$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: 'style-loader!css-loader!stylus-loader'
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

if (isDev) {
  config = merge(config, {
    devtools: 'eval-source-map',
    devServer: {
      host: '0.0.0.0',
      port: 9008,
      hot: true,
      contentBase: path.join(__dirname, 'dist'),
    }
  })
}

module.exports = config
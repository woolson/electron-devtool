const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'

let config = {
  mode: isDev ? 'development' : 'production',
  entry: './renderer/index.js',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'renderer.js',
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
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
}

if (isDev) {
  config = merge(config, {
    devtool: 'eval-source-map',
    devServer: {
      host: '0.0.0.0',
      port: 9008,
      hot: true,
      quiet: true,
      contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development',
        template: 'build/index.html'
      }),
      new FriendlyErrorsWebpackPlugin()
    ]
  })
}

module.exports = config
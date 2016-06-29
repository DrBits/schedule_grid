'use strict'

var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require("path")

module.exports = {  
  entry: './src/client/app/app.ts',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    alias: {
      angular: path.resolve('./node_modules/angular/angular.min.js'),
    },
  },
  module: {
    loaders: [
      { 
        test: /\.ts$/, 
        loader: 'ts-loader' 
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/app/main.html'
    }),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin()
  ]
}

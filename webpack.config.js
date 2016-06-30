'use strict'

const webpack = require('webpack')
const ClosureCompilerPlugin = require('webpack-closure-compiler')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path")

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
      moment: path.resolve('./node_modules/moment/min/moment-with-locales.min.js'),
      jquery: path.resolve('./node_modules/jquery/dist/jquery.min.js')
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
    // new webpack.optimize.UglifyJsPlugin(),
    // new ClosureCompilerPlugin({
    //   compiler: {
    //     language_in: 'ECMASCRIPT6',
    //     language_out: 'ECMASCRIPT5',
    //     compilation_level: 'SIMPLE_OPTIMIZATIONS'
    //     // 'warning_level': 'VERBOSE'
    //   },
    //   concurrency: 3
    // })

  ]
}

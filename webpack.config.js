'use strict';

const webpack = require('webpack');
// const ClosureCompilerPlugin = require('webpack-closure-compiler');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const res = p => path.resolve(__dirname, p[0]);

module.exports = {
  entry: './src/client/app/app.ts',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    alias: {
      angular: res`./node_modules/angular/angular.min.js`,
      moment: res`./node_modules/moment/min/moment-with-locales.min.js`,
      jquery: res`./node_modules/jquery/dist/jquery.min.js`,
      lodash: res`./node_modules/lodash/dist/lodash.min.js`
    }
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
      },
      {
        test: /\.html$/,
        include: res`src/client/app/templates`,
        loader: `ngtemplate!html`
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/app/main.html'
    }),

    new webpack.optimize.DedupePlugin()
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: false,
    //   mangle: false
    // }),
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
};

// console.log(require('util').inspect(module.exports, {colors: true, depth: 4}))

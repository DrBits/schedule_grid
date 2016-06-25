'use strict'

var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {  
  entry: './src/client/app/app.ts',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.scss']
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
    })
  ]
}

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './main.jsx'],
  devtool: 'source-map',
  output: {
    //path: path.join(__dirname, 'public'),
    path: __dirname,
    filename: '../static/static/bundle.js'
  },
  module: {
  	  loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'stage-1', 'react'],
            plugins: ['transform-es2015-destructuring']
          }
        },
        {
          test: /\.scss$/,
          loaders: ["style-loader", "css?modules", "sass-loader"]
        },
        {
          test: /\.css$/,
          loaders: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /.(png|woff(2)?|eot|ttf|svg)([\?]?.*)?$/, loader: 'url-loader?limit=1000000'
        },
    ]
  }
};

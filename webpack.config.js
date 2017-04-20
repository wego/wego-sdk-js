var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    npm: "./src/index.js",
    bower: "./bower_entry.js",
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};

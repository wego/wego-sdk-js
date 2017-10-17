var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    npm: "./src/index.js",
    bower: "./bower_entry.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
    libraryTarget: "commonjs-module"
  },
  resolve: {
    extensions: ["*", ".js"],
    modules: [path.join(__dirname, "src")]
  }
};

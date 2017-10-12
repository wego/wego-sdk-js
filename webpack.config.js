var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    npm: "./src/index.js",
    bower: "./bower_entry.js"
  },
  resolve: {
    extensions: ["", ".js"],
    modulesDirectories: ["node_modules", "./"],
    root: [path.join(__dirname, "src")]
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  }
};

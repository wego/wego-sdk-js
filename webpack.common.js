const { resolve } = require('path');

module.exports = {
  entry: {
    'WegoSdk': './src/index.js',
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
    library: '[name]',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
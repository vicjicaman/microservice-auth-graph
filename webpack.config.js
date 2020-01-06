const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',

  externals: [nodeExternals()],

  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    }]
  },
  resolve: {
    alias: {
      Api: path.resolve(__dirname, 'src/api'),
      Model: path.resolve(__dirname, 'src/model'),
      Schema: path.resolve(__dirname, 'src/schema'),
      PKG: path.resolve(__dirname, 'pkg')
    },
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.json']
  }
};

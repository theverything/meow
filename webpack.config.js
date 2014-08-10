var path = require("path");
var webpack = require("webpack");
var config = require("./config");
var UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
  cache: true,
  entry: config.rootPath.scripts + "main.js",
  output: {
    path: path.join(__dirname, "dist/static/scripts"),
    publicPath: "scripts/",
    filename: "[name].js",
    chunkFilename: "[chunkhash].js"
  },
  module: {
    loaders: [
      // required for react jsx
      { test: /\.js$/,    loader: "jsx-loader" },
      { test: /\.jsx$/,   loader: "jsx-loader?insertPragma=React.DOM" },
    ]
  },
  resolve: {},
  plugins: [
    //new UglifyJsPlugin()
  ]
};

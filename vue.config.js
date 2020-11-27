const path = require("path");
var webpack = require("webpack");

module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "src/assets/theme.scss")]
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require("./vendor-manifest.json")
      })
    ]
  }
};

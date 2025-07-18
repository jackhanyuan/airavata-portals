const BundleTracker = require("webpack-bundle-tracker");

module.exports = {
  publicPath: "/static/common/dist/",
  pages: {
    app: "./js/main.js",
    cms: "./js/cms.js",
    notices: "./js/notices.js",
  },
  configureWebpack: {
    plugins: [
      new BundleTracker({ filename: './dist/webpack-stats.json' })
    ],
    output: {
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[name].[contenthash].js'
    }
  },
  css: {
    extract: {
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css'
    }
  }
};

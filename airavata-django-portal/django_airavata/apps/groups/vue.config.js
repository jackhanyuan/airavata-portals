const BundleTracker = require("webpack-bundle-tracker");

module.exports = {
  publicPath:
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/static/django_airavata_groups/dist/"
      : "/static/django_airavata_groups/dist/",
  outputDir: "./static/django_airavata_groups/dist",
  pages: {
    "group-list": "./static/django_airavata_groups/js/group-listing-entry-point.js",
    "group-create": "./static/django_airavata_groups/js/group-create-entry-point.js",
    "group-edit": "./static/django_airavata_groups/js/group-edit-entry-point.js",
  },
  configureWebpack: {
    plugins: [
      new BundleTracker({ filename: './static/django_airavata_groups/dist/webpack-stats.json' })
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
  },
  devServer: {
    port: 9000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    hot: true,
  },
};

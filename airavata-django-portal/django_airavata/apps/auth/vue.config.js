const BundleTracker = require("webpack-bundle-tracker");

module.exports = {
  publicPath:
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/static/django_airavata_auth/dist/"
      : "/static/django_airavata_auth/dist/",
  outputDir: "./static/django_airavata_auth/dist",
  pages: {
    "user-profile": "./static/django_airavata_auth/js/entry-user-profile",
  },
  configureWebpack: {
    plugins: [
      new BundleTracker({ filename: './static/django_airavata_auth/dist/webpack-stats.json' })
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

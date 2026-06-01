// fix react-scripts 3.5+ do not support import alias(paths in tsconfig.json)
// https://stackoverflow.com/questions/57070052/create-react-app-typescript-3-5-path-alias

const CracoAlias = require("craco-alias");
const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer/"),
        process: require.resolve("process/browser.js"),
        stream: require.resolve("stream-browserify"),
      };
      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser.js",
        }),
      ];
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: "./src",
        /* tsConfigPath should point to the file where "baseUrl" and "paths"
        are specified*/
        tsConfigPath: "./tsconfig.paths.json"
      }
    }
  ]
};
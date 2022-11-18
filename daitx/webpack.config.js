const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    // Other rules...
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
        fallback: {
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http")
        }
    }
}

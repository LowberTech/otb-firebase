const path = require('path')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        app: ['./src/index.js'],
    },
    module: {
        rules: [
            {
              test: /\.css$/,
              use: ["style-loader", "css-loader"]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    experiments: {
        topLevelAwait: true
    },
    plugins: [
        new NodePolyfillPlugin()
    ],

    watch: true
}


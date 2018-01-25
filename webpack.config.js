const path = require('path');
const BabiliPlugin = require('babili-webpack-plugin');

const bundleConfig = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jokr.bundle.min.js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    plugins: [
        new BabiliPlugin({}, {
            test: /\.js$/,
            exclude: /node_modules/,
            comments: false,
            babel: require("babel-core"),
            babili: require("babel-preset-babili")
        })
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    }
};

module.exports = [bundleConfig];
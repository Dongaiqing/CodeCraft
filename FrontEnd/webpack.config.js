const path = require('path');
module.exports = {
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }]
    },
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, '../static/js'),
        publicPath: '/static/js/',
        filename: "[name].bundle.js",
        chunkFilename: '[name].bundle.js'
    },
    watch: true,
    mode: 'development',
    devtool: "#eval-source-map"
};
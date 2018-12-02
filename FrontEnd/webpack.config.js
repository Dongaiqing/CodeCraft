const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            }, {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            }
        ]
    },
    // plugins: [
    //     new CompressionPlugin({
    //         test: /\.js(\?.*)?$/i,
    //         algorithm: 'gzip'
    //     })
    // ],
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, '../static/js'),
        publicPath: '/static/js/',
        filename: "[name].bundle.js",
        chunkFilename: '[name].bundle.js'
    },
    watch: true,
    mode: 'production',
    devtool: "#eval-source-map"
};
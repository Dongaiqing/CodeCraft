const path = require('path');
const sass = require("node-sass");
const sassUtils = sassUtils = require("node-sass-utils")(sass);
const Variables = require(__dirname + "/styles/variables.js");
module.exports = {
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                {loader: "style-loader"},
                {loader: "css-loader"},
                {loader: "sass-loader"}
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
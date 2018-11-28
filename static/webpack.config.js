module.exports = {
    module: {
        rules: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
        ]
    },
    entry: "./index.js",
    output: {
        filename: "dist.js"
    },
    watch: true,
    mode: 'development',
    devtool: "#eval-source-map"
};
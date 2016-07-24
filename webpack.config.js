module.exports = {
    entry: "feed.js",
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
    }]
}

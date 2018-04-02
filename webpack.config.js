const path                  = require('path');
const CleanWebpackPlugin    = require('clean-webpack-plugin');

module.exports = {
    devtool: 'source-map',

    entry: './src/index.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/build'),

        publicPath: 'build'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },

    resolve: {
        extensions: ['.js']
    },

    plugins: [
        new CleanWebpackPlugin(['public/build'])
    ],

    devServer: {
        port: 3000,
        contentBase: './public',
        compress: true,
        historyApiFallback: true
    }
};
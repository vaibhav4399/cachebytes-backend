const path = require('path');
const nodeExternals =  require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const terser =  require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './dist/server.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: true,
        minimizer: [new terser()]
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: [
        nodeExternals()
    ]

}
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

const CONTEXT_PATH = path.resolve(__dirname, 'client');
const PUBLIC_PATH = path.resolve(__dirname, 'public');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    context: CONTEXT_PATH,
    entry: {
        app: './app/app.js'
    },
    output: {
        filename: '[name].[chunkhash].bundle.js',
        path: PUBLIC_PATH
    },
    plugins: [
        new CleanWebpackPlugin(PUBLIC_PATH),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].bundle.css'
        }),
        new ManifestPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader'
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'img',
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            name: 'common',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor'
                }
            }
        }
    }
};
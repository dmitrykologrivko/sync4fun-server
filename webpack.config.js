const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

const DEVELOPMENT_ENV = 'development';
const PRODUCTION_ENV = 'production';

const MODE = process.env.NODE_ENV || DEVELOPMENT_ENV;
const CONTEXT_PATH = path.resolve(__dirname, 'client');
const PUBLIC_PATH = path.resolve(__dirname, 'public');

const isDevelopment = MODE === DEVELOPMENT_ENV;
const isProduction = MODE === PRODUCTION_ENV;

module.exports = {
    mode: MODE,
    context: CONTEXT_PATH,
    entry: {
        app: './app/app.js',
        home: './home/home.js'
    },
    output: (() => {
        const common = {
            filename: '[name].js',
            path: PUBLIC_PATH
        };

        const production = {
            filename: '[name].[chunkhash].js'
        };

        return isProduction
            ? {...common, ...production}
            : common;
    })(),
    plugins: (() => {
        const common = [
            new ManifestPlugin()
        ];

        const production = [
            new CleanWebpackPlugin(PUBLIC_PATH),
            new MiniCssExtractPlugin({
                filename: '[name].[chunkhash].css'
            })
        ];

        const development = [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ];

        return isProduction
            ? [...production, ...common]
            : [...development, ...common];
    })(),
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

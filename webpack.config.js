const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/js/Loading_progress/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: '8082',
        open: true
    },
    resolve: {
        alias: {
            "@module": path.resolve(__dirname, 'static/models/glTF'),
            "@util": path.resolve(__dirname, 'src/util')
        },
        // extensions: ['.gltf', '.bin', '.png']
    },
    module: {
        rules: [
            // * css
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            // * 图片
            {
                test: /\.(png|gif|jpeg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/[name][hash:8][ext]'
                }
            },
            // * 字体
            {
                test: /\.(ttf|woff2|otf|json)$/,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name][ext]",
                },
            },
            {
                test: /\.(gltf|glb|bin|png|jpg)$/,
                type: "asset/resource",
                generator: {
                    filename: "static/models/glTF/[name][ext]",
                },
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_moudules/,
                use:[
                    'raw-loader'
                ]
            }
        ]
    },
    plugins: [

        // html
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({ template: './src/index.html' }),

        // css
        new MiniCssExtractPlugin({
            filename: "./src/css/global.css",
        }),

        // clean dist
        new CleanWebpackPlugin()
    ]
}
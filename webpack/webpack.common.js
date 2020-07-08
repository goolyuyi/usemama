const Path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    output: {
        path: Path.join(__dirname, '../build'),
        filename: 'js/[name].js'
    },
    plugins: [
        new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
        // new CopyWebpackPlugin({
        //         patterns: [
        //             {from: '**/*',context:'public/'}]
        //     }
        // ),
    ],
    resolve: {
        alias: {
            '~': Path.resolve(__dirname, '../src')
        }
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|webp)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ]
            },
            {
                test: /\.svg$/,
                use: [

                    {
                        loader: 'svg-inline-loader',
                        options: {
                            removeSVGTagAttrs: true
                        }
                    },
                    {loader: 'svgo-loader'}
                ]
            }
        ]
    }
};

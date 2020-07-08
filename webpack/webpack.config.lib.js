const Webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');
const Path = require('path');
const autoprefixer = require('autoprefixer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safeParser = require('postcss-safe-parser');
const TerserPlugin = require('terser-webpack-plugin');
const postcssNormalize = require('postcss-normalize');

module.exports = merge(common, {
    entry: {
        app: Path.resolve(__dirname, '../src/module.js'),
    },
    mode: 'production',
    devtool: 'source-map',
    stats: 'errors-only',
    bail: true,
    output: {
        path: Path.join(__dirname, '../lib'),
        filename: 'usemama.min.js',
        chunkFilename: '[name].bundle.js',
        libraryTarget: 'umd',
        globalObject: 'this',
        // libraryExport: 'default',
        library: 'usemama',
        umdNamedDefine: true
    },
    externals: {
        'react': 'react',
        'react-dom':'react-dom',
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new MiniCssExtractPlugin({
            filename: 'usemama.css',
            // chunkFilename: opt.chunkFilename,
        }),
        // Minify css - but use only safe css-nano transformations
        // https://github.com/facebook/create-react-app/pull/4706
        new OptimizeCSSAssetsPlugin({cssProcessorOptions: {parser: safeParser, safe: true}}),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    // {
                    //     loader: require.resolve('thread-loader'),
                    // },
                    {
                        loader: require.resolve('babel-loader'),
                        // options: {
                        //     // cache builds, future builds attempt to read from cache to avoid needing to run expensive babel processings
                        //     cacheDirectory: true,
                        //     // do not include superfluous whitespace characters and line terminators
                        //     // https://babeljs.io/docs/en/babel-core/#options
                        //     compact: true,
                        // },
                    }
                ]
            },
            {
                test: /\.s?css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // The css file will be probably be placed in a sub directory.
                            // To prevent invalid ressource urls this additional sub folder
                            // has to be taken into account for the relative path calculation
                            // publicPath: (Path.relative(Path.dirname(opt.filename), '.') + Path.sep).replace(
                            //     /^[\\/]$/,
                            //     ''
                            // ),
                        }
                    },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 3,
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                require('postcss-preset-env')({
                                    autoprefixer: {
                                        flexbox: 'no-2009',
                                    },
                                    stage: 3,
                                }),
                                // Adds PostCSS Normalize as the reset css with default options,
                                // so that it honors browserslist config in package.json
                                // which in turn let's users customize the target behavior as per their needs.
                                postcssNormalize(),
                            ],
                            sourceMap: true,
                        },
                    },
                    {
                        loader: require.resolve('resolve-url-loader'),
                    },
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                            sourceMap: true,
                        },
                    }

                ]

            }
        ]
    },


    optimization: {
        minimize: true,
        minimizer: [
            // This is only used in production mode
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // We want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minification steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending further investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    // Added for profiling in devtools
                    // keep_classnames: true,
                    // keep_fnames: true,
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
                sourceMap: true,
            }),
            // This is only used in production mode
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safeParser,
                    map: true
                        ? {
                            // `inline: false` forces the sourcemap to be output into a
                            // separate file
                            inline: false,
                            // `annotation: true` appends the sourceMappingURL to the end of
                            // the css file, helping the browser find the sourcemap
                            annotation: true,
                        }
                        : false,
                },
                cssProcessorPluginOptions: {
                    preset: ['default', {minifyFontValues: {removeQuotes: false}}],
                },
            }),
        ],
        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        splitChunks: {
            chunks: 'all',
            name: false,
        },
        // Keep the runtime chunk separated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        // https://github.com/facebook/create-react-app/issues/5358
        // runtimeChunk: {
        //     name: entrypoint => `runtime-${entrypoint.name}`,
        // },
    },

});

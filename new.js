var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

module.exports = function (env) {
    return [
    // www
    {
        watch: true,
        context: __dirname + '/app/scripts.babel/',
        entry: {
            background: './background.js', // remove unused
            chromereload: './chromereload.js',
            contentscript: './contentscript.js',
            popup: './popup.js',
        },
        output: { filename: '[name].js' },
        module: {
            rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // presets: ['es2015', "stage-2"],
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this nessessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    },
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
            },

            {
                test: /\.json$/,
                loader: 'json-loader'

            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",

                })
                //use: ['style-loader', 'css-loader'],
                // options: {
                //     minimize: true
                // },

            },

            // {
            //     test: /\.(png|jpg|gif|svg)$/,
            //     loader: 'file-loader',
            //     options: {
            //         name: '[name].[ext]?[hash]'
            //     }
            // },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }
            ]
        },
        //externals: [/^(?!\.|\/).+/i,],
        //devtool: '#source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': { NODE_ENV: JSON.stringify(env) }
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                'window.Tether': "tether",
                'Tether': "tether",
                'markdown': "bootstrap-markdown",
                Popper: ['popper.js', 'default']
            }),

            new ExtractTextPlugin({
                //filename: '[name].css',
                filename: (getPath) => {
                    return getPath('[name].css').replace('js', 'css');
                    //return getPath('[name].[hash:8].css').replace('js', 'css');
                },
                allChunks: true

            }),
            new HtmlWebpackPlugin({
                //filename: '[name].css',
                // title: "GEEKBLR",
                filename: 'views/index.html',
                template: 'src/server/views/index.html',
                hash: true,
                minify: {
                    collapseWhitespace: true,
                    //preserveLineBreaks: true,                    
                    removeComments: true,
                    collapseBooleanAttributes: true,
                    removeEmptyAttributes: true
                }

            }),

            new CopyWebpackPlugin([
                // { from: 'src/www/favicon/**/*', to:'/www/favicon/' },
                {
                    context: 'src/www/favicon',
                    from: '**/*',
                    to: './www/favicon'
                }
            ])
        ]
    },

    //admin

    {
        watch: true,
        entry: {
            'admin/js/app': './src/admin/app.js',
            // 'job': './src/server/job.js'

        },
        output: {
            path: path.join(__dirname, './dist'),
            //filename: '[name].[hash:8].js',
            filename: '[name].js',
            publicPath: '/',
            //sourceMapFilename: '[name].map'
        },
        resolve: {
            extensions: ['.js', '.vue'],
        },
        module: {
            rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // presets: ['es2015', "stage-2"],
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this nessessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    },
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
            },

            {
                test: /\.json$/,
                loader: 'json-loader'

            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",

                })
                //use: ['style-loader', 'css-loader'],
                // options: {
                //     minimize: true
                // },

            },

            // {
            //     test: /\.(png|jpg|gif|svg)$/,
            //     loader: 'file-loader',
            //     options: {
            //         name: '[name].[ext]?[hash]'
            //     }
            // },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }
            ]
        },
        //externals: [/^(?!\.|\/).+/i,],
        //devtool: '#source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': { NODE_ENV: JSON.stringify(env) }
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                'window.Tether': "tether",
                'Tether': "tether",
                Popper: ['popper.js', 'default']
            }),

            new ExtractTextPlugin({
                //filename: '[name].css',
                filename: (getPath) => {
                    return getPath('[name].css').replace('js', 'css');
                    //return getPath('[name].[hash:8].css').replace('js', 'css');
                },
                allChunks: true

            }),

            new HtmlWebpackPlugin({
                //filename: '[name].css',

                filename: 'views/admin.html',
                template: 'src/server/views/admin.html',
                hash: true,
                minify: {
                    collapseWhitespace: true,
                    //preserveLineBreaks: true,                    
                    removeComments: true,
                    collapseBooleanAttributes: true,
                    removeEmptyAttributes: true
                }

            })


        ]
    }

    ]

}
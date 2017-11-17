var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
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
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
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
    }
}
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    devtool: "inline-source-map",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        // publicPath: '/' // Виртуальный путь для сервера (важно для devServer!)
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9001,
        hot: true,
        historyApiFallback: true   // Перевод на главную страницу index.html
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "./templates" },
                { from: "./node_modules/admin-lte/plugins/fontawesome-free/webfonts", to: "./webfonts" },
                { from: "./node_modules/admin-lte/plugins/fontawesome-free/css/all.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/dist/css/adminlte.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/plugins/jquery/jquery.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/dist/js/adminlte.min.js", to: "./js" },
            ],
        }),
    ],
};
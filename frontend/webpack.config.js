const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    devtool: "inline-source-map",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/', // Виртуальный путь для сервера (важно для devServer!)
        clean: true,
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
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "./templates" },
                { from: "./src/static/images", to: "./images" },
                { from: "./node_modules/admin-lte/plugins/fontawesome-free/webfonts", to: "./webfonts" },
                { from: "./node_modules/admin-lte/plugins/fontawesome-free/css/all.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/dist/css/adminlte.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/plugins/jquery/jquery.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/dist/js/adminlte.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/plugins/datatables/jquery.dataTables.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/plugins/bs-custom-file-input/bs-custom-file-input.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/plugins/moment/moment.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/plugins/moment/locale/ru.js", to: "js/moment-ru-locale.js" },
                { from: "./node_modules/admin-lte/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/plugins/select2/js/select2.full.min.js", to: "./js" },
                { from: "./node_modules/admin-lte/plugins/select2/css/select2.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css", to: "./css" },
                { from: "./node_modules/admin-lte/plugins/fullcalendar/main.js", to: "js/fullcalendar.js" },
                { from: "./node_modules/admin-lte/plugins/fullcalendar/locales/ru.js", to: "js/fullcalendar-locale-ru.js" },
                { from: "./node_modules/admin-lte/plugins/fullcalendar/main.css", to: "css/fullcalendar.css" },
                { from: "./.env", to: "./" },

            ],
        }),
    ],
};
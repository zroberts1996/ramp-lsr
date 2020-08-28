const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pluginName = 'search-plugin';

module.exports = function(variable={}, argv) {
    const config = {
        mode: argv.mode,
        devtool: argv.mode === 'development' ? 'cheap-module-eval-source-map' : false,

        entry: ['./src/loader.js'],

        output: {
            path: path.join(__dirname, `../dist/${pluginName}`),
            filename: `./${pluginName}.js`
        },

        resolve: {
            extensions: ['.ts', '.js', '.css', '.scss']
        },

        module: {
            rules: [
                {
                    test: /\.s?[ac]ss$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                },
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    include: [__dirname],
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|svg)$/,
                    use: 'url-loader'
                }
            ]
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename:  `./${pluginName}.css`
            }),

            new CopyWebpackPlugin([
                {
                    from: 'src/samples/*.+(html|json)',
                    to: 'samples/[name].[ext]',
                    toType: 'template',
                },
                {
                    from: '../fgpv/*.+(js|css)',
                    to: '../fgpv'
                }
            ])
        ],

        devServer: {
            host: '0.0.0.0',
            https: false,
            disableHostCheck: true,
            port: 6001,
            stats: { colors: true },
            compress: true,
            contentBase: [path.join(__dirname, `../dist/${pluginName}`), path.join(__dirname, '../dist')],
            watchContentBase: true
        }
    };

    return config;
};
const path = require('path');

module.exports = {
    entry: {
        main: ['./src/index.ts', './src/styles/style.scss']
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.scss', '.sass']
    },
    output: {
        filename: 'vincario-charts-lib.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
};

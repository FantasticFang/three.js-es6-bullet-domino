const path = require('path');
const webpack = require('webpack');
const env = process.env.npm_package_config_webpack_env;
const hot = process.env.npm_package_config_webpack_env_devServer;
const libraryName = 'project3d';

// 向上一级得到项目的根目录
function resolve(folder) {
    return path.resolve(__dirname, '..', folder);
}
// ------------------------------------------------------------------------------------------------

let outputFile = '';
let plugins = [];
let minimize = false;
let isDev = true;

if (env === 'release') {
    isDev = false;
    minimize = true;
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + '.min.js';
} else {
    // this will be included automatically when enable inline property of devServer
    // plugins.push(new webpack.HotModuleReplacementPlugin());

    outputFile = libraryName + '.js';
}

module.exports = {
    mode: 'development',
    entry: './src/index.js',

    output: {
        filename: outputFile,
        path: path.resolve(__dirname, '..', 'dist'),
        library: libraryName
    },

    optimization: {
        minimize: minimize
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: resolve('node_modules'),
                include: resolve('src'),
                use: {
                    loader: 'eslint-loader',
                    options: {
                        baseConfig: false
                        // configFile: resolve('.eslintrc.js')
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: [
                    resolve('node_modules'),
                    resolve('worker')
                ],
                include: [
                    resolve('src'),
                    resolve('libs')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            // ['transform-object-rest-spread', { 'useBuiltIns': true }],
                            ['transform-runtime', { 'polyfill': false, 'regenerator': false }],
                            ['transform-es2015-template-literals']
                        ],
                        presets: [
                            ['env', {
                                targets: {
                                    browsers: ['last 5 versions', 'chrome >= 52', 'FireFox >= 44', 'Safari >= 7', 'Explorer 11', 'last 4 Edge versions']
                                },
                                modules: 'umd',
                                loose: false,
                                // https://www.jianshu.com/p/0dc3bddb6da8
                                useBuiltIns: 'false' // "usage" | "entry" | false
                            }]
                        ]
                    }
                }
            }
        ]
    },

    plugins: plugins
};

// check document: https://webpack.js.org/configuration/dev-server/
if (hot) {
    module.exports['devServer'] = {
        contentBase: './',
        publicPath: '/dist/', // Make sure publicPath always starts and ends with a forward slash.
        inline: true,
        hot: true,
        stats: 'errors-only', // normal, minimal, errors-only
        overlay: true,
        clientLogLevel: 'info',
        open: 'chrome',
        openPage: 'test.html'
    };
}

if (isDev) {
    module.exports['devtool'] = 'source-map';
}
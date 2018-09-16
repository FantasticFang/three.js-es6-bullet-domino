const path = require('path');

// 向上一级得到项目的根目录
function resolve(folder) {
    return path.resolve(__dirname, '..', folder);
}
// ------------------------------------------------------------------------------------------------

module.exports = {
    mode: 'development',

    entry: './src/test.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '..', 'dist')
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
            }
        ]
    }
};
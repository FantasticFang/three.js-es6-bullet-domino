module.exports = {
    extends: ['eslint-config-alloy'],
    parserOptions: {
        // @see https://github.com/eslint/eslint/issues/10307
        // override 2017
        'ecmaVersion': 9,
        'sourceType': 'module'
    },
    globals: {
        // 这里填入你的项目需要的全局变量
        // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
        //
        // jQuery: false,
        // $: false

        // 这里定义好在polyfills里全局符号，防止误报
        'joinPaths': false,
        'searchFileNameFromURL': false,
        'formatPathFromURL': false,
        'IsFloat32Array': false,
        'isArrayBuffer': false,
        'clamp01': false,
        'msgpack': false,
        'Ammo':false
    },
    rules: {
        // 这里填入你的项目需要的个性化配置，比如：
        //
        // // @fixable 一个缩进必须用两个空格替代
        // 'indent': [
        //     'error',
        //     2,
        //     {
        //         SwitchCase: 1,
        //         flatTernaryExpressions: true
        //     }
        // ]
        'no-empty-function': 'off'
    }
};
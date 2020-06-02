var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
var { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
var DashboardPlugin = require('webpack-dashboard/plugin');
// 分析打包资源大小
// const smp = new SpeedMeasurePlugin({
//     outputFormat: 'human'
// })
module.exports={
    entry: {
        main: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },

    plugins: [
        // 根据模板，自动生成html
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'), // 模板位置
            filename: 'index.html', // 生成文件名称
            minify: {
                removeComments: true, // 删除注释
                collapseWhitespace: true, // 压缩空格
                minifyCSS: true, // 压缩css
            },
        }),
        // 打包或运行前，删除dist目录
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.resolve(__dirname, 'dist'),
            ],
        }),
        // 监视打包后bundle资源
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerPort: 8899,
        }),
        // 优化控制台输出
        new DashboardPlugin(),
    ],
    stats: 'normal', // 控制台显示统计信息

}
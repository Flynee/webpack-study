var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
var { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
// 分析打包资源大小
const smp = new SpeedMeasurePlugin({
    outputFormat: 'human'
})
module.exports= smp.wrap({
    entry: {
        main: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        // 别名
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '#': path.resolve(__dirname, 'public'),
        },
    },
    module: {
        
        rules: [
            {   // 加载css, scss
                test: /\.(css|s[ac]ss)$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }, {
                // 处理css中引用图片
                test: /\.(jpe?g|png|svg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 8,
                        name:'static/img/[name].[hash:8].[ext]'
                    }
                }
            }, {
                // 处理html中引用图片
                test: /\.(htm|html)$/,
                use: ['html-loader']
            }
        ]
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
        new ProgressBarPlugin({
            format: 'build [:bar] :percent (:elapsed seconds)',
            clear: false, 
            width: 60
        })
    ],
    stats: { // 控制台显示统计信息
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }, 

})
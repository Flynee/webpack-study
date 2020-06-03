var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
var SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
var { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var webpack = require('webpack');
// 分析打包资源大小
var smp = new SpeedMeasurePlugin({
    outputFormat: 'human'
})

module.exports= smp.wrap({
    entry: {
        main: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './static/js/[name].[hash:8].bundle.js',
        chunkFilename: './static/js/[name].[hash:8].chunk[id].js'
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            name: 'static/css/[name].[hash:8].css'
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            }, {
                // 处理css中引用图片
                test: /\.(jpe?g|png|svg|gif)$/,
                include: [path.resolve(__dirname, 'src')],
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
            }, {
                // 处理字体文件
                test: /\.(eot|ttf|woff2?)$/,
                include: [path.resolve(__dirname, 'src/assets')],
                use: {
                    loader: 'file-loader',
                    options: {
                       name: 'static/font/[name].[hash:8].[ext]',
                    }
                }
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
        }),
        // 提取css|scss
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[hash:8].css' ,
            chunkFilename: 'static/css/[name].[hash:8].chunk[id].css',
        }),
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
      
    ],
    stats: { // 控制台显示统计信息
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }, 
    // 配置源文件映射
    devtool: 'nosources-source-map',
    // devtool: 'inline-source-map',
    devServer: {
        hot: true
    }

})
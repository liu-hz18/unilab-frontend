const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// gzip压缩
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_SRC : "/",
  outputDir: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_OUTPUT_DIR : "dist",
  assetsDir: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_STATIC_DIR : "assets",
  transpileDependencies: true,
  productionSourceMap: false,
  // `devServer` only work for local development mode
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hot: true,
    proxy: {
      '/api': {
        target: 'https://lab.cs.tsinghua.edu.cn/unilab/api',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api':''
        }
      }
    },
  },
  configureWebpack: {
    plugins: [
      new ProgressBarPlugin(),  //打包进度条
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.css/,
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        // 删除原文件
        // 如果开发环境要用就设置未false,不然编辑以后页面打不开
        // 如果就生产环境用可以设置为true,这样打包后的体积更小
        deleteOriginalAssets: false 
      }),
    ],
    externals: process.env.NODE_ENV === 'production' ? {
      // 指定需要挂载的第三方库 格式：  第三方库名 ：'库在项目中的别名'
      // 注意element-ui别名只能用ELEMENT，改了会出现undefined的保存
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      axios: 'axios',
      xlsx: 'XLSX',
      // codemirror: 'CodeMirror',
      // 'vue-codemirror-lite': 'VueCodeMirror',
      // 'vue-meditor': 'makdown',
      // echarts: 'echarts',
      'element-ui': 'ELEMENT',
    }: {}, 
  },
}

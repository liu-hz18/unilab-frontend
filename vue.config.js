const ProgressBarPlugin = require('progress-bar-webpack-plugin')

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
    ],
    externals: process.env.NODE_ENV === 'production' ? {
      // 指定需要挂载的第三方库 格式：  第三方库名 ：'库在项目中的别名'
      // 注意element-ui别名只能用ELEMENT，改了会出现undefined的保存
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      axios: 'axios',
      // echarts: 'echarts',
      'element-ui': 'ELEMENT'
    }: {}, 
  },
}

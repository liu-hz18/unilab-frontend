module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_SRC : "/",
  outputDir: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_OUTPUT_DIR : "dist",
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
}

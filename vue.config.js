module.exports = {
  transpileDependencies: true,
  // `devServer` only work for local development mode
  devServer: {
    open: true,
    host: 'localhost',
    port: 80,
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

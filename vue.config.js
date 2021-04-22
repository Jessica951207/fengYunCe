'use strict'

const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
var baseUrl = 'http://10.1.3.42:8900'
// var baseUrl = 'http://192.168.5.2:8900'
// var baseUrl = 'https://gitee.com'

//test
// var baseUrl = 'http://http://192.168.88.84:8900'

module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    lintOnSave: false,
    devServer: {
        open: true, // 自动打开浏览器
        host: '0.0.0.0', // 真机模拟，使用
        port: '8080', // 前台代理端口号
        https: false, // https： {type: Booleam}
        hotOnly: false, // 热更新
        proxy: {
            // 设置代理
            '/re': {
                target: baseUrl,
                ws: true,
                changeOrigin: true,
                secure: false,
                // pathRewrite: {
                //     '^/re': '/',
                // },
            },
        },
        // proxy: {
        //     // 设置代理
        //     '/gitee': {
        //         target: baseUrl,
        //         ws: true,
        //         changeOrigin: true,
        //         secure: false,
        //         pathRewrite: {
        //             '^/gitee': '',
        //         },
        //     },
        // },
    },
    chainWebpack(config) {
    // 移除打包后 index.html 所有打包好的文件都预加载行为
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');

    //set svg-sprite-loader
      config.module
          .rule('svg')
          .exclude.add(resolve('src/icons'))
          .end();

      config.module
          .rule('icons')
          .test(/\.svg$/)
          .include.add(resolve('src/icons'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
              symbolId: 'icon-[name]'
          });

  }


};

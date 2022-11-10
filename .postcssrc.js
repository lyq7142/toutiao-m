// postCSS的配置文件
// postCSS是css处理工具，解析css代码再交给插件处理
// postcss.config.js
module.exports = {
  plugins: {
    // 自动生成浏览器css规则前缀，兼容
    // vuecli内部已经配置了autoprefixer插件
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0','iOS >= 8']
    // },
    // 把px转为rem
    'postcss-pxtorem': {
      // lib-flexible的REM适配方案，把一行分为10份，值为设计稿宽度的十分之一，750 / 10
      // vant基于375写的，所以375 / 10，缺点 设计稿尺寸都要 / 2
      // rootValue: 37.5,
      // 更好的办法 动态处理请求   vant按37.5 自己的样式按75
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的css属性  * 所有属性
      propList: ['*']
    }
  }
}

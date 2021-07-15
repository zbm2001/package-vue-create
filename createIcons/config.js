const path = require('path')

module.exports = {
  // 指定图标库目录
  entryDir: path.resolve('src/assets/images/icons'),
  // 生成图标库样式集文件
  outputFilepathname: path.resolve('src/scss/icons.scss'),
  // 图标库目录下，匹配指定后缀名的图标文件
  // 字符串或正则，分别按自己方式匹
  suffix: /\.(?:png|gif|jpe?g)$/,
  // 索引模板文件，若文件不存在则视为模版字符串
  template: path.join(__dirname, 'icons.scss.dot')
}

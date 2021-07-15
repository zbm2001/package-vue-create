const path = require('path')

module.exports = {
  // 指定页面配置文件（页面清单）
  // 若自定义文件，建议规范路径 'scripts/create/createPages/pages.config.js'
  configFile: path.resolve('scripts/create/createPages/pages.config.js'),
  // 生成的页面备份目录
  copyOutputDir: path.resolve('scripts/create/pages/pages'),
  // 生成的页面目录
  srcOutputDir: path.resolve('src/pages'),
  // 页面模版文件，若文件不存在则视为模版字符串
  // 若自定义文件，建议规范路径 'scripts/create/createPages/page-simple.vue.dot'
  template: path.join(__dirname, './page-simple.vue.dot')
}

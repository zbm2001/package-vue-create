const path = require('path')

module.exports = {
  // 指定配置文件（组件清单）
  // 若自定义文件，建议规范路径 'scripts/create/createComponents/components.config.js'
  configFile: path.join(__dirname, './components.config.js'),
  // 生成的组件备份目录
  copyOutputDir: path.resolve('scripts/create/createComponents/components'),
  // 生成的组件目录
  srcOutputDir: path.resolve('src/components'),
  // 指定组件模板文件路径，若文件不存在则视为模版字符串
  // 若自定义文件，建议规范路径 'scripts/create/createComponents/component.vue.dot'
  template: path.resolve(__dirname, 'component.vue.dot'),
  // 生成组件目录下的索引文件名
  indexOutputFile: 'index.js',
  // 索引模板文件，若文件不存在则视为模版字符串
  indexTemplate: path.resolve(__dirname, 'componentsIndex.js.dot')
}

// 生成指定目录下的索引文件
const path = require('path')

module.exports = {
  // 指定索引目录
  entryDir: process.cwd(),
  // 生成索引目录下的索引文件名
  outputFile: 'index.js',
  // 索引目录下，匹配指定后缀名的文件才会被索引
  suffix: '.js',
  // 索引模板文件，若文件不存在则视为模版字符串
  template: path.resolve(__dirname, './index.js.dot'),
  // 模版函数的自定义 def 参数
  templateDef: {},
  // 模版函数的默认 def 参数
  _templateDefaultDef: {
    // 是否需要 banner 注释
    // 若为字符串，则用该字符串作为 banner
    banner: true,
    // 是否导入通配符 import * as module from 'module'
    // 若为字符串，则用该字符串作为 importWildcard
    importWildcard: true,
    // 是否导出通配符 export * from 'module'
    // 若为字符串，则用该字符串作为 exportWildcard
    exportWildcard: false,
    // 是否导出多个模块 export {module}
    // 若为字符串，则用该字符串作为 exportModules
    exportModules: false,
    // 是否导出默认模块 export default {module}
    // 若为字符串，则用该字符串作为 exportDefault
    exportDefault: true
  }
}

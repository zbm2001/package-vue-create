const path = require('path')
const {entryDir} = require('./config')
const {configFile: pagesConfigFile} = require('../createPages/config')
const {configFile: componentsConfigFile} = require('../createComponents/config')

module.exports = {
  // 配置语种
  languages: [
    'zh-CN',
    'en-US'
  ],
  // 指定目录
  entryDir,
  // 生成语种文件 src/i18n/languages.js
  outputFile: 'languages.js',
  // 语种模板文件，若文件不存在则视为模版字符串
  template: path.join(__dirname, 'languages.js.dot'),
  // 生成语种索引文件 src/i18n/index.js
  indexOutputFile: 'index.js',
  // 语种索引模板文件，若文件不存在则视为模版字符串
  indexTemplate: path.join(__dirname, 'index.js.dot'),
  // webpack 编译模块文件名前缀
  webpackChunkNamePrefix: 'i18n$',

  // 生成各语种目录下的索引文件名 src/i18n/(zh-CN|en-US|...)/index.js
  indexLanguageOutputFile: 'index.js',
  // 语种目录索引模板文件，若文件不存在则视为模版字符串
  indexLanguageTemplate: path.join(__dirname, 'language-index.js.dot'),

  // 页面配置文件
  pagesConfigFile,
  // 生成语种页面合集的文件名 src/i18n/(zh-CN|en-US|...)/pages.js
  pagesLanguageOutputFile: 'pages.js',
  // 语种页面模板文件，若文件不存在则视为模版字符串
  pageLanguageTemplate: path.join(__dirname, 'language-page.js.dot'),

  // 组件配置文件
  componentsConfigFile,
  // 生成语种组件合集的文件名 src/i18n/(zh-CN|en-US|...)/components.js
  componentsLanguageOutputFile: 'components.js',
  // 语种组件模板文件，若文件不存在则视为模版字符串
  componentLanguageTemplate: path.join(__dirname, 'language-component.js.dot'),

  // 语种公共常用词句文件 src/i18n/(zh-CN|en-US|...)/common.js
  commonFile: path.resolve('scripts/create/createI18n/common.js')
}

const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const md5File = require('md5-file')
const {compileToFn} = require('../../utils/dot')
const {regex_delimiters_g, regex_hyphensLowercase_g, regex_hyphens_g} = require('../utils/regexes')

const defaultConfig = require('./config')
const defaultPagesConfig = require('./pages.config.js')

/**
 * 对页面设置做加工处理
 * @params {object} pageConfig 单个页面配置
 * @params {string} suffix 页面文件后缀
 * @params {string} namePrefix 页面名后缀
 * @params {string} rootClassPrefix 页面根元素样式类前缀
 * @params {function} i18nExp 国际化文本获取
 * @returns {object|null}
 */
function pageConfigSet (pageConfig, {suffix, namePrefix, rootClassPrefix, i18nExp}) {
  const {pathname} = pageConfig
  // 若为文件夹
  if (pathname.slice(-1) === '/') return null
  // 拼接路径后缀名
  let pathfilename = pathname + suffix
  // 分解路径片段
  let segments = pathname.split('/')
  // 相对路径深度
  let relativePathDepth = segments.length - 1
  // 相对路径前缀
  let relativePathPrefix = '../'.repeat(relativePathDepth)

  // 语种字段的前缀：'$' + 路径md5的前4位 + '_'
  let i18n_keyPrefix = '$' + md5(pathname).slice(0, 4) + '_'

  // 文件路径键
  let i18n_pathnameKey = i18n_keyPrefix + 'pathname'

  // 语种页面标题键
  let i18n_titleKey = i18n_keyPrefix + 'title'
  // 语种页面标题值
  let i18n_title = i18nExp(i18n_titleKey)

  // 去路径化转换
  let unpathPageName = pathname.replace(regex_delimiters_g, '-')

  // 页面组件名称
  // let pageName = String.camelcase(unpathPageName, true)
  let pageName = unpathPageName.replace(regex_hyphensLowercase_g, (m, $1) => $1.toUpperCase())
  pageName = namePrefix + pageName

  // 根据路径创建出页面根元素样式类
  let rootClass = String.reverseCamelcase(unpathPageName).replace(regex_hyphens_g, '-')
  // 拼接出完整页面根元素样式类
  rootClass = rootClassPrefix + rootClass

  return {
    ...pageConfig,
    pathfilename,
    relativePathDepth,
    relativePathPrefix,
    i18n_pathnameKey,
    i18n_keyPrefix,
    i18n_titleKey,
    i18n_title,
    pageName,
    rootClass
  }
}

/**
 * 获取页面配置数据
 * @params {string|object} configFile 页面配置文件路径或配置数据
 * @returns {object}
 */
function getPagesConfig (configFile) {
  const {pageList, ...pagesConfig} = typeof configFile === 'string' ? require(configFile) : configFile
  pagesConfig.pageList = []
  pageList.forEach(pageConfig => {
    const newPageConfig = pageConfigSet(pageConfig, pagesConfig)
    newPageConfig && pagesConfig.pageList.push(newPageConfig)
  })
  return pagesConfig
}

/**
 * 写入页面文件
 * @param {Object} pageConfig 页面配置信息
 * @param {String} srcOutputDir 写入页面目录的目标文件夹
 * @param {String} pageContent 页面内容
 * @param {Boolean} unoverwrite 是否避免覆盖已有同名文件
 * @param {String?} pathfilenameKey
 */
function writePageFile (pageConfig, srcOutputDir, pageContent, unoverwrite, pathfilenameKey = 'pathfilename') {
  if (!pageConfig[pathfilenameKey]) return

  let filePath = path.join(outputDir, pageConfig[pathfilenameKey])
  // console.log('filePath', filePath)

  let folderPath = filePath.slice(0, filePath.lastIndexOf(path.sep))

  if (!fs.existsSync(folderPath)) mkdirs(folderPath)

  // 直接将新建生成的页面文件写入对应目录的页面目录下
  if (!unoverwrite || !fs.existsSync(filePath)) fs.writeFileSync(filePath, pageContent)
}


function createPages (config = {}) {
  const {template, configFile, copyOutputDir, srcOutputDir} = {...defaultConfig, ...config}

  const consoleTimeName = 'create pages: ' + configFile
  console.time(consoleTimeName)

  // 删除原页面目录备份
  if (fs.existsSync(copyOutputDir)) rm('-rf', copyOutputDir)
  fs.mkdirSync(copyOutputDir)

  const templateFn = compileToFn(template)
  const pagesConfig = {...defaultPagesConfig, ...getPagesConfig(configFile)}


  pagesConfig.pageList.forEach(pageConfig => {

    const pageContent = templateFn(pageConfig)

    // 生成页面目录备份
    writePageFile(pageConfig, copyOutputDir, pageContent, false)

    // 生成页面目录，其中不覆盖已有同名文件
    writePageFile(pageConfig, srcOutputDir, pageContent, true)
  })

  console.timeEnd(consoleTimeName)
}

module.exports = {
  getPagesConfig,
  createPages,
}

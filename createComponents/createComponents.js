require('../../utils/String')
const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const md5File = require('md5-file')
const {mkdirs} = require('../utils/fs-plugins')
const {compileToFn} = require('../../utils/dot')
const {
  regex_delimiters_g,
  regex_hyphensLowercase_g,
  regex_hyphens_g
} = require('../utils/regexes')

const defaultConfig = require('./config')
const defaultComponentsConfig = require(defaultConfig.configFile)

/**
 * 对组件设置做加工处理
 * @params {object} componentConfig 单个组件配置
 * @params {string} suffix 组件文件后缀
 * @params {string} namePrefix 组件名后缀
 * @params {string} rootClassPrefix 组件根元素样式类前缀
 * @params {function} i18nExp 国际化文本获取
 * @returns {object|null}
 */
function componentConfigSet (componentConfig, {suffix, namePrefix, rootClassPrefix, i18nExp}) {
  const {pathname, async} = componentConfig
  // 若为文件夹
  if (pathname.slice(-1) === '/') return null
  // 拼接路径后缀名
  let pathfilename = pathname + suffix
  // 分解路径片段
  let segments = pathname.split('/')
  // 相对路径深度
  let relativePathDepth = segments.length - 1
  // 相对路径前缀
  let relativePathPrefix = '../'.repeat(relativePathDepth) // 路径前缀

  // 语种字段的前缀：'$' + 路径md5的前4位 + '_'
  let i18n_keyPrefix = '$' + md5(pathname).slice(0, 4) + '_'

  // 文件路径键
  let i18n_pathnameKey = i18n_keyPrefix + 'pathname'

  // 语种组件标题键
  let i18n_titleKey = i18n_keyPrefix + 'title'
  // 语种组件标题值
  let i18n_title = i18nExp(i18n_titleKey)

  // 去路径化转换
  let unpathComponentName = pathname.replace(regex_delimiters_g, '-')

  // 组件名称
  // let componentName = String.camelcase(unpathComponentName, true)
  let componentName = unpathComponentName.replace(regex_hyphensLowercase_g, (m, $1) => $1.toUpperCase())
  componentName = namePrefix + componentName + (async ? 'Async' : '')

  // 根据路径创建出页面根元素样式类
  let rootClass = String.reverseCamelcase(unpathComponentName).replace(regex_hyphens_g, '-')
  // 拼接出完整组件根元素样式类
  rootClass = rootClassPrefix + rootClass + '-async'

  let dir = pathfilename.slice(0, pathfilename.lastIndexOf('/') + 1)
  pathfilename = dir + componentName + suffix

  return {
    ...componentConfig,
    pathfilename,
    relativePathDepth,
    relativePathPrefix,
    i18n_pathnameKey,
    i18n_keyPrefix,
    i18n_titleKey,
    i18n_title,
    componentName,
    rootClass
  }
}

/**
 * 获取组件配置数据
 * @params {string|object} configFile 组件配置文件路径或配置数据
 * @returns {object}
 */
function getComponentsConfig (configFile) {
  const {componentList, ...componentsConfig} = typeof configFile === 'string' ? require(configFile) : configFile
  componentsConfig.componentList = []
  componentList.forEach(componentConfig => {
    const newComponentConfig = componentConfigSet(componentConfig, componentsConfig)
    newComponentConfig && componentsConfig.componentList.push(newComponentConfig)
  })
  return componentsConfig
}

/**
 * 写入组件文件
 * @param {Object} componentConfig 组件配置信息
 * @param {String} srcOutputDir 写入组件目录的目标文件夹
 * @param {String} componentContent 组件内容
 * @param {Boolean} unoverwrite 是否避免覆盖已有同名文件
 * @param {String?} pathfilenameKey
 */
function writeComponentFile (componentConfig, srcOutputDir, componentContent, unoverwrite, pathfilenameKey = 'pathfilename') {
  if (!componentConfig[pathfilenameKey]) return

  let filePath = path.join(srcOutputDir, componentConfig[pathfilenameKey])
  // console.log('filePath', filePath)

  let folderPath = filePath.slice(0, filePath.lastIndexOf(path.sep))

  if (!fs.existsSync(folderPath)) mkdirs(folderPath)

  // 直接将新建生成的组件文件写入对应目录的组件目录下
  if (!unoverwrite || !fs.existsSync(filePath)) fs.writeFileSync(filePath, componentContent)
}

function createComponents (config) {
  const {template, configFile, copyOutputDir, srcOutputDir} = {...defaultConfig, ...config}

  const consoleTimeName = 'create components: ' + configFile
  console.time(consoleTimeName)

  // 删除原组件目录备份
  if (fs.existsSync(copyOutputDir)) rm('-rf', copyOutputDir)
  fs.mkdirSync(copyOutputDir)

  const templateFn = compileToFn(template)
  const componentsConfig = {...defaultComponentsConfig, ...getComponentsConfig(configFile)}

  componentsConfig.componentList.forEach(componentConfig => {

    const componentContent = templateFn(componentConfig)

    // 生成至组件目录备份
    writeComponentFile(componentConfig, copyOutputDir, componentContent, false)

    // 生成至组件目录，其中不覆盖已有同名文件
    writeComponentFile(componentConfig, srcOutputDir, componentContent, true)
  })

  console.timeEnd(consoleTimeName)
}

module.exports = {
  getComponentsConfig,
  createComponents
}

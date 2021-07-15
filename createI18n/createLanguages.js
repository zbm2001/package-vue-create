require('shelljs/global')
const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const md5File = require('md5-file')
const {compileToFn, compileToStr} = require('../../utils/dot')

const defaultConfig = require('./languages.config')
const {getPagesConfig} = require('../createPages')
const {getComponentsConfig} = require('../createComponents')

/**
 * 生成语种文件：src/i18n/languages.js
 */
function createLanguages (config = {}) {
  const {languages, entryDir, outputFile, template} = {...defaultConfig, ...config}

  const consoleTimeName = 'create languages: ' + languages
  console.time(consoleTimeName)

  const content = compileToStr(template, languages)
  const outputPathname = path.resolve(entryDir, outputFile)

  if (!fs.existsSync(outputPathname) || md5(content) !== md5File.sync(outputPathname)) {
    fs.writeFileSync(outputPathname, content)
  }

  console.timeEnd(consoleTimeName)
}

/**
 * 通过文件配置列表创建数组，存放各文件专属键值的文本
 * @param fileConfigList 文件配置清单
 * @param template 模版文件
 * @returns {array[string]}
 */
function createFileKeyValuesList (filesConfigList, template) {
  const templateFn = compileToFn(template)
  const fileKeyValuesList = filesConfigList.map(fileConfig => {
    return templateFn(fileConfig).trimRight()
  })
  return fileKeyValuesList
}

function createLanguageFolders (config = {}) {
  const {
    languages,
    entryDir,

    pagesConfigFile,
    pagesLanguageOutputFile,
    pageLanguageTemplate,

    componentsConfigFile,
    componentsLanguageOutputFile,
    componentLanguageTemplate,

    indexLanguageOutputFile,
    indexLanguageTemplate,

    commonFile,
    regex_index_$m
  } = {...defaultConfig, ...config}

  const consoleTimeName = 'build i18n languages folders: ' + languages
  console.time(consoleTimeName)

  // 生成语种各页面组合内容列表
  const {pageList} = getPagesConfig(pagesConfigFile)
  const pageKeyValuesList = createFileKeyValuesList(pageList, pageLanguageTemplate)


  const {componentList} = getComponentsConfig(componentsConfigFile)
  const componentKeyValuesList = createFileKeyValuesList(componentList, componentLanguageTemplate)

  // 生成索引页内容
  const indexContent = compileToStr(indexLanguageTemplate)

  const commonFilename = /([^/]+)$/.test(commonFile) && RegExp.$1

  // 创建语种目录
  languages.forEach(language => {
    // 语种文件夹
    let folder = path.join(entryDir, language)
    fs.existsSync(folder) || mkdirs(folder)

    // 生成各语种目录下的索引文件
    const indexLanguageOutputFilepath = path.join(folder, indexLanguageOutputFile)
    if (!fs.existsSync(indexLanguageOutputFilepath)) {
      if (fs.existsSync(indexLanguageTemplate)) {
        fs.copyFileSync(indexLanguageTemplate, indexLanguageOutputFilepath)
      } else {
        fs.writeFileSync(indexLanguageOutputFilepath, indexLanguageTemplate)
      }
    }

    // 拷贝语种公共文件
    const commonOutputFile = path.join(folder, commonFilename)
    if (!fs.existsSync(commonOutputFile)) {
      fs.copyFileSync(commonFile, commonOutputFile)
    }

    // 语种索引页路径
    let indexOutputFile = path.join(folder, 'index.js')

    // 若语种索引页已存在
    if (fs.existsSync(indexOutputFile)) {
      // 读取内容比对
      let indexContent = fs.readFileSync(indexOutputFile, 'utf8')
      // console.log('indexContent', indexContent)
      pageList.forEach((pageConfig, i) => {
        // 检测是否含该页面路径标识
        if (!indexContent.includes("'" + pageConfig.pathfilename + "'")) {
          // console.log('indexOutputFile', indexOutputFile)
          // console.log('page.pathfilename', page.pathfilename)
          // console.log('page.pathfilename', regex_index_$gm.test(content))
          indexContent = indexContent.replace(regex_index_$m, () => {
            return `,\n\n  ${pageContents[i]}\n`
          })
        }
      })
      fs.writeFileSync(indexOutputFile, indexContent)
    } else {
      fs.writeFileSync(indexOutputFile, indexContent)
    }
  })

  console.timeEnd(consoleTimeName)
}

function createLanguageIndex (config = {}, ) {
  const {languages, entryDir, languageIndexOutputFile, languageIndexTemplate} = {...defaultConfig, ...config}


}

/**
 * 生成语种索引文件：src/i18n/index.js
 */
function createI18nIndex (config = {}) {
  const {languages, entryDir, pagesConfigFile, indexOutputFile, indexTemplate, webpackChunkNamePrefix} = {...defaultConfig, ...config}

  const consoleTimeName = 'create i18n index: ' + languages
  console.time(consoleTimeName)

  const folders = languages.map(language => {
    let folder = {
      pathname: './' + language,
      locale: language,
      webpackChunkName: webpackChunkNamePrefix + language
    }
    return folder
  })

  const content = compileToStr(indexTemplate, folders)
  const indexOutputPathname = path.resolve(entryDir, indexOutputFile)

  if (!fs.existsSync(indexOutputPathname) || md5(content) !== md5File.sync(indexOutputPathname)) {
    fs.writeFileSync(indexOutputPathname, content)
  }

  console.timeEnd(consoleTimeName)
}

modules.exports = {
  createLanguages,
  createLanguageFolders,
  createLanguageIndex,
  createI18nIndex
}

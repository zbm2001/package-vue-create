const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const md5File = require('md5-file')
const {getDirtreeVueFiles} = require('../utils/fs-plugins')
const {compileToStr} = require('../../utils/dot')
const {regex_components_pathname} = require('../utils/regexes')
const {getComponentsConfig} = require('./createComponents')

const defaultConfig = require('./config')
const defaultComponentsConfig = require(defaultConfig.configFile)

exports.createComponentsIndex = function createComponentsIndex (config = {}) {
  const {indexTemplate, configFile, srcOutputDir: entryDir, indexOutputFile} = {...defaultConfig, ...config}

  const consoleTimeName = 'create componentsIndex: ' + configFile
  console.time(consoleTimeName)

  const componentNameMap = Object.create(null)
  const {componentList, suffix} = {...defaultComponentsConfig, ...getComponentsConfig(configFile)}

  componentList.forEach(componentConfig => {
    componentNameMap[componentConfig.pathfilename] = componentConfig
  })

  // let files = getDirtreeAsyncVueFiles(entryDir)
  let files = getDirtreeVueFiles(entryDir)

  let components = []

  files.forEach(file => {
    file.pathname.replace(regex_components_pathname, (m, $1, $2) => {
      // let unpathComponentName = $1.replace(regex_delimiters_g, '-')
      // components.push({
      //   componentName: 'Component' + unpathComponentName.replace(regex_hyphensLowercase_g, (m, $1) => $1.toUpperCase()), // 组件名称
      //   webpackChunkName: 'components' + $1.replace(regex_pathSeparator_g, '$'),
      //   relativePath: '.' + $1
      // })
      const componentConfig = componentNameMap[$2]
      const layout = componentConfig && componentConfig.layout
      const component = {
        layout,
        componentName: $2, // 组件名称
        async: $2.endsWith('Async'), // 异步组件，启用下面的 webpackChunkName
        webpackChunkName: $2,
        relativePath: '.' + $1
      }
      components.push(component)
    })
  })

  components.sort((a, b) => a.componentName > b.componentName ? 1 : a.componentName < b.componentName ? -1 : 0)

  const componentContent = compileToStr(indexTemplate, components)

  const indexOutputPathname = entryDir + indexOutputFile

  if (!fs.existsSync(indexOutputPathname) || md5(componentContent) !== md5File.sync(indexOutputPathname)) {
    fs.writeFileSync(indexOutputPathname, componentContent)
  }

  console.timeEnd(consoleTimeName)
}

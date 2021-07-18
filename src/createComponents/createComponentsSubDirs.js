
const path = require('path')
const {readdirtree, mkdirs} = require('@zbm1/pkg-utils/src//path-plugins')

const {srcOutputDir: defaultPagesDir} = require('../createPages/config')
const {srcOutputDir: defaultComponentsDir} = require('./config')

/**
 * 创建组件子目录，对应于页面目录
 * @param {String} pagesDir 页面目录
 * @param {String} componentsDir 组件目录
 */
exports.createComponentsSubDirs = function createComponentsSubDirs (pagesDir = defaultPagesDir, componentsDir= defaultComponentsDir) {

  // 创建提取的页面公共组件目录
  const dirtreeList = readdirtree(pagesDir, ({isDir}) => !!isDir, 0, 1) // 只获取创建第一层目录
  // console.log('dirtreeList', dirtreeList.map(({pathname}) => pathname))

  dirtreeList.forEach(({pathname}) => {
    const dirPath = pathname.replace(pagesDir, componentsDir)
    if (!fs.existsSync(dirPath)) {
      mkdirs(dirPath)
      let gitkeepPathname = path.join(dirPath, '.gitkeep')
      fs.writeFileSync(gitkeepPathname, '')
    }
  })
}

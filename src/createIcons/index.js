const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const md5File = require('md5-file')
const {getQueryFiles, getDirtreeImgFiles, sortFilesByPathname} = require('@zbm1/pkg-utils/src/path-plugins')
const {compileToStr} = require('@zbm1/pkg-utils/src/dot')
const {regex_delimiters_g, regex_icons_pathname, regex_icon_active} = require('../utils/regexes')

const defaultConfig = require('./config')

exports.createIcons = function createIcons (config = {}) {
  const {entryDir, outputFilepathname, suffix, template} = {...defaultConfig, ...config}

  const consoleTimeName = 'create icons: ' + options.entryDir
  console.time(consoleTimeName)

  // let files = getDirtreeImgFiles(entryDir)
  let files = []
  if (suffix) {
    if (typeof suffix === 'string') {
      let files = getQueryFiles(entryDir, ({isFile, filename}) => {
        return isFile && filename.endsWith(suffix)
      })
    } else if (suffix.test) {
      let files = getQueryFiles(entryDir, ({isFile, filename}) => {
        return isFile && suffix.test(filename)
      })
    } else {
      files = getDirtreeImgFiles(entryDir)
    }
  } else {
    files = getDirtreeImgFiles(entryDir)
  }

  sortFilesByPathname(files)

  let icons = files.map(file => {
    let icon = {}
    file.pathname.replace(regex_icons_pathname, (m, $1, $2, $3, $4) => {
      icon.path = '../' + $1
      icon.className = $3.replace(regex_delimiters_g, '-')
      let activeClass = icon.className.replace(regex_icon_active, '')
      if (icon.className !== activeClass) {
        icon.activeClass = activeClass
      }
    })
    return icon
  })

  const content = compileToStr(template, icons)

  if (!fs.existsSync(outputFilepathname) || md5(content) !== md5File.sync(outputFilepathname)) {
    fs.writeFileSync(outputFilepathname, content)
  }

  console.timeEnd(consoleTimeName)
}

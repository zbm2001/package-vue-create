const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const md5File = require('md5-file')
const {getChildFiles, sortFilesByPathname} = require('../../utils/fs-plugins')
const {compileToStr} = require('../../utils/dot')

const defaultConfig = require('./config')

exports.createIndex = function createIndex (config) {
  const {entryDir, outputFile, suffix, template, templateDef = {}, _templateDefaultDef} = {...defaultConfig, ...config}
  const def = {..._templateDefaultDef, ...templateDef}

  // 打印开始
  const consoleTimeName = 'create index: ' + entryDir
  console.time(consoleTimeName)

  let filenames = []
  let files = getChildFiles(entryDir, suffix)

  files.forEach((file) => {
    filenames.push(path.basename(file.filename, suffix))
  })

  filenames.sort()

  const content = compileToStr(template, filenames, def)
  const outputPathname = path.join(entryDir, outputFile)

  // 判断新建文件或文件变化
  if (!fs.existsSync(outputPathname) || md5(content) !== md5File.sync(outputPathname)) {
    fs.writeFileSync(outputPathname, content)
  }

  // 打印结束
  console.timeEnd(consoleTimeName)
}

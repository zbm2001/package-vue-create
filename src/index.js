// const {createIndex} = require('./createIndex')
// const {createIcons} = require('./createIcons')
// const {createPages, getPagesConfig} = require('./createPages')
// const {
//   createComponents,
//   createComponentsSubDirs,
//   createComponentsIndex
// } = require('./createComponents')
// const {
//   createLanguages,
//   createI18nIndex,
//   createLanguageFolders,
//   createLanguageIndex
// } = require('./createI18n')

module.exports = {
  ...require('./createIndex'),
  ...require('./createIcons'),
  ...require('./createPages'),
  ...require('./createComponents'),
  ...require('./createI18n'),
}

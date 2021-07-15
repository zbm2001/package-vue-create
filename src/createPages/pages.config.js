/**
 * 整体页面配置
 * 生成页面命令：$ npm run create:pages
 * 脚本文件：/scripts/create/pages/index.js
 * 生成目录：/src/pages
 * 备份目录：/scripts/create/pages/pages
 */

module.exports = {
  // 页面文件后缀
  suffix: '.vue',
  // 页面组件名前缀
  namePrefix: 'Page',
  // 页面根元素样式类前缀
  rootClassPrefix: 'page',
  // 国际化文本获取
  i18nExp: (key) => `$t('${key}')`,
  // 页面清单
  pageList: [
    // {
    //   pathname: '/404',
    //   title: '404 页面找不到了'
    // }
  ]
}

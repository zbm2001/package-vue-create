/**
 * 整体组件配置
 * 生成页面命令：$ npm run create:components
 * 脚本文件：/scripts/create/createComponents/index.js
 * 生成目录：/src/components
 * 备份目录：/scripts/create/createComponents/components
 */
module.exports = {
  // 组件文件后缀
  suffix: '.vue',
  // 组件名前缀
  namePrefix: 'Com',
  // 组件根元素样式类前缀 prefix-
  rootClassPrefix: 'com',
  // 国际化文本获取
  i18nExp: (key) => `$t('${key}')`,
  // 组件配置清单
  componentList: [
    // {
    //   pathname: '/layouts/mobile/nav-footer',
    //   title: '移动端底部主导航'
    // }
  ]
}

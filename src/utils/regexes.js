
// 匹配：一或多个连字符或下划线
export const regex_delimiters_g = /[/_-]+/g

// 匹配：一或多个连字符+字母
export const regex_hyphensLowercase_g = /-+([a-zA-Z0-9])/g

// 匹配：一或多个连字符
export const regex_hyphens_g = /-+/g

// 匹配：路径分割器（正、反斜杠)
export const regex_pathSeparator_g = /[/\\]/g

// 图标库路径匹配
export const regex_icons_pathname = /^.+\/src\/((assets\/images\/icons\/)(\S+?[^/]+)(\.png|gif|jpe?g))$/i
// 图标激活状态文件名匹配
export const regex_icon_active = /-active(?=(?:-[23]x)?$)/

// 组件库路径匹配
export const regex_components_pathname = /^.+\/src\/components(\/\S*?([^/]+))\.vue$/

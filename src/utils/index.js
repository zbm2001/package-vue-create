const fs = require('fs')

export function getTemplate (template) {
  if (fs.existsSync(template)) {
    template = fs.readFileSync(template, 'utf8')
  }
  return template
}

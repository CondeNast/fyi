const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-4) === '.hbs')
  })
  .forEach(file => {
    module.exports[file.slice(0, -4)] = handlebars.compile(fs.readFileSync(path.join(__dirname, file)).toString())
  })

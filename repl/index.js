let repl = require('repl')
let models = require('../src/models')

let replServer = repl.start({
  prompt: 'fyi-repl > '
})

replServer.context.unwrap = (p) => {
  p.then((val) => {
    replServer.context.__ = val
    console.log(val)
  })
}

require('bluebird/js/release/promise')().prototype.unwrap = function () {
  this.then((val) => {
    replServer.context.__ = val
    console.log(val)
  })
}

replServer.context.models = models

for (let key in models) {
  replServer.context[key] = models[key]
}

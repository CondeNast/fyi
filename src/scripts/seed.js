let Fyi = require('../models').Fyi
Fyi.loadFromConfluence().then(() => process.exit())

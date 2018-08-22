const Fyi = require('../../models').Fyi
const resolve = require('path').resolve

Fyi.loadRepoFromCSV(resolve('./src/scripts/seed-repos-from-csv/repos.csv')).then(() => process.exit())

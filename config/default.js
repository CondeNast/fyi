let username = require('os').userInfo().username

module.exports = {
  'database': {
    'username': username,
    'password': null,
    'database': 'easy-fyi-development',
    'host': '127.0.0.1',
    'dialect': 'postgres'
  }, 
  github: {
    listening_to_orgs: ['choosenearme', 'mage-contest'],
    fyi_repo_org: 'choosenearme',
    fyi_repo_name: 'fyis'
  }

}

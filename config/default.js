let username = require('os').userInfo().username

module.exports = {
  'username': username,
  'database': {
    'username': username,
    'password': null,
    'database': 'easy-fyi-development',
    'host': '127.0.0.1',
    'dialect': 'postgres'
  },
  'github': {
    'subscribedOrgs': ['choosenearme', 'mage-contest'],
    'adminOrg': 'choosenearme',
    'adminRepo': 'fyis',
    'adminUsers': ['johnkpaul', 'gautamarora']
  },
  'confluence': {
    'fyiPageId': '209682505'
  },
  'slack': {
    'webhook': 'https://hooks.slack.com/services/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',
    'channel': 'easy-fyi-dev'
  }
}

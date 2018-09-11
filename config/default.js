let username = require('os').userInfo().username

module.exports = {
  'username': username,
  'database': {
    'username': username,
    'password': null,
    'database': 'easy-fyi-development',
    'host': '127.0.0.1',
    'dialect': 'postgres',
    'logging': false
  },
  'github': {
    'subscribedOrgs': ['choosenearme', 'mage-contest'],
    'adminOrg': 'choosenearme',
    'adminRepo': 'fyis',
    'adminUsers': ['johnkpaul', 'gautamarora']
  },
  'confluence': {
    'fyiPageId': '367493172',
    'spaceKey': '~111165544'
  },
  'slack': {
    'enabled': true,
    'channel': 'easy-fyi-dev'
  },
  'datadog': {
    'enabled': true
  }
}

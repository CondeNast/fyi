let username = process.env.POSTGRES_USER || require('os').userInfo().username

let secrets
try {
  secrets = require('./secrets.json')
} catch(e) {
  secrets = {
    "data": null
  }
}

module.exports = {
  'username': username,
  'database': {
    'username': username,
    'password': process.env.POSTGRES_PASSWORD || null,
    'database': process.env.POSTGRES_DB || 'easy-fyi-development',
    'host': process.env.POSTGRES_HOST || '127.0.0.1',
    'port': process.env.POSTGRES_PORT || '5432',
    'dialect': 'postgres',
    'logging': false
  },
  'github': {
    'subscribedOrgs': ['choosenearme', 'mage-contest'],
    'adminOrg': 'choosenearme',
    'adminRepo': 'fyi-admin',
    'adminUsers': ['johnkpaul', 'gautamarora']
  },
  'confluence': {
    'fyiPageId': '367493172',
    'spaceKey': '~111165544',
    'hostname': 'cnissues',
  },
  'slack': {
    'enabled': true,
    'channel': 'fyi-dev'
  },
  'datadog': {
    'enabled': true
  },
  'vault': {
    secrets
  }
}

let username = require("os").userInfo().username;

module.exports = {
  "database": {
    "username": username,
    "password": null,
    "database": "easy-fyi-development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

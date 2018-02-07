# easy-fyi

This is an FYI creation tool that will allow the creation of FYIs from emails, slackbots, or external forms. It is intended to wrap the Confluence API and provide a user interface for the most simple cases. 

### Requirements

This package uses Node.JS v8+ and cn-vault and Postgres

Install Postgres locally via https://postgresapp.com/


### Usage

```shell

$ npm i
$ source ./node_modules/.bin/authenticate-vault
$ cd db
$ # Update db/config/config.json with your database user and db name
$ ../node_modules/.bin/sequelize db:migrate
$ ../node_modules/.bin/sequelize db:seed:all
$ cd ../
$ source ./node_modules/.bin/authenticate-vault && node index.js

```

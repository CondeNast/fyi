# easy-fyi [![](http://easy-fyi-stag.conde.io/badge/easy-fyi)](http://easy-fyi-stag.conde.io/badge/easy-fyi)

A Github App to automate the FYI request workflow.

## Project Brief

This application, and the accompanying work of the Architecture team is intended to facilitate and streamline 3 key goals.

1. **Ease of documenting system dependencies**
We want it to be very easy for the product, engineering, and design teams to be able to document what systems we have within Conde Nast, and how they are connected. Historically, this has been attempted through many charts and diagrams and we are attempting to consolidate and bring significant automation to the process.
2. **Ease of human discovery of existing/new systems**
We want the people within product, engineering, and design to be able to, very easily and quickly, find information about systems within Conde Nast. At the very least, they should be able to find out, from only knowing the name of a system, 1) what it does and 2) where it fits into the landscape.
3. **Ease of finding existing ways of doing something within our systems**
We want to reduce effort and reuse existing work as much as possible. We want it to be straigthforward to find out what features and functionality existing systems already support and clear ways of how to integrate them into new work done by any team.

### Phases

1. **Phase 1**
Our first phase of work will be to go after the first goal. Our target audience is product, design and engineering leaders who we need to continue to document what systems we are creating. We will be making this as streamlined and easy as possible by automating many parts of the workflow. The Architecture team will also be requesting documentation about specific, key parts of our systems using this workflow.
2. **Phase 2**
Our second phase of work will be to focus on discovery. We want to make it easy for us to broadcast new update, additions and changes to our systems.

### Glossary

1. **System**
Any portion of our company that has software backing it. By way of example, Copilot, Salesforce, HAL, APIs of all sorts,

### Requirements

This package uses Node.JS v8+, probot and cn-vault. It assumes [Postgres.app](https://postgresapp.com/) is already installed for local development and a database schema is created with the name `easy-fyi-development`.

### Integration test setup

create a test account and test database in postgres

`psql
CREATE ROLE test_account LOGIN;
GRANT <<Replace with your username>> TO test_account;
CREATE DATABASE "easy-fyi-test";
`


### Usage

```shell

$ npm i
$ source ./node_modules/.bin/authenticate-vault
$ npm run sequelize -- db:migrate
$ npm start

```

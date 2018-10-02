# FYI

Discover and Explore your Organization's System Architecture

[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](LICENSE) [![](http://fyi.conde.io/badge/easy-fyi)](http://fyi.conde.io/link/easy-fyi) [![](http://fyi.conde.io/badge/arch-bot)](http://fyi.conde.io/link/arch-bot)

_Proudly built by:_

<a href="https://technology.condenast.com"><img src="https://user-images.githubusercontent.com/1215971/35070721-3f136cdc-fbac-11e7-81b4-e3aa5cc70a17.png" title="Conde Nast Technology" width=350/></a>

## Introduction

The FYI application was built by the Architecture Team at Condé Nast to stay on top of their growing technology portfolio of systems (sites, apps, apis) distributed across hundreds of repositories in multiple GitHub organizations.

This application has two parts:

  - a Github App to discover code repositories and request FYIs from developers
  - a Web App to view interactive architecture diagrams with system dependencies and metrics

[TODO - Demo Video Here]

### Built Using

  1. Probot (Github App Framework)
  2. Create React App
  3. Postgres SQL
  4. Vault
  5. Integrations with: Confluence, Slack, Datadog

## Install

### Step 1: Setting Up Services

  1. Run `cp secrets.json.example secrets.json` in your terminal
  1. Setup SMEE
    1. Go to `https://smee.io/`
    2. Start a new channel
    3. In secrets.json, copy this smee channel url as the value for "webhook-proxy-url"
  2. Setup a Github Org
    1. Go to `https://github.com/organizations/new` to start a new organization
  3. Setup a Github App
    1. Go to `https://github.com/settings/apps/new` and create a new Github App
    2. TODO - User authorization callback URL?
    3. Set "Webhook URL" to the SMEE.io url from above
    4. Set "Webhook secret" to `development`
    5. In secrets.json, copy the GitHub private key as the value for "github-private-key"
  4. Setup a FYI Admin repository
    1. Go to `https://github.com/new` and create a new repository `fyi-admin`
  5. Setup Confluence Space and Page
    1. TODO
  6. Setup Slack (optional)
    1. TODO
  7. Setup Datadog (optional)
    1. TODO

### Step 2: Running With Docker (recommended)
  1. Build Docker Image: `docker build -t easy-fyi-image .`
  2. Run Application: `docker-compose up`
  3. Open your browser and go to `http://localhost:4001`

### Running Without Docker

  1. `npm i`
  2. `npm run install:client`
  3. `npm start`
  4. Open your browser and go to `http://localhost:3001`



## Usage

### Creating a new FYI
TODO

### Adding a dependency to FYI
TODO

### Adding a Repository to FYI
TODO

### Alerts for New Repository creation
TODO

## Thanks

TODO

## Contributors

See the list of [contributors](https://github.com/CondeNast/fyi/contributors) who participated in writing this tool.

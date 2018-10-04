# 💁 FYI

Discover and Explore your Organization's System Architecture

[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](LICENSE) [![](http://fyi.conde.io/badge/56)](http://fyi.conde.io/link/56) [![](http://fyi.conde.io/badge/162)](http://fyi.conde.io/link/162)

_Proudly built by:_

<a href="https://technology.condenast.com"><img src="https://user-images.githubusercontent.com/1215971/35070721-3f136cdc-fbac-11e7-81b4-e3aa5cc70a17.png" title="Conde Nast Technology" width=350/></a>

## 🤔 Introduction

The FYI application was built by the Architecture Team at Condé Nast to stay on top of their growing technology portfolio of systems (sites, apps, apis) distributed across hundreds of repositories in multiple GitHub organizations.

This application has two parts:

  - a Github App to discover code repositories and request FYIs from developers
  - a Web App to view interactive architecture diagrams with system dependencies and metrics

[TODO - Demo Video Here]

### 🔨 Built Using

  1. Probot (Github App Framework)
  2. Create React App
  3. Postgres SQL
  4. Vault
  5. Integrations with: Confluence, Slack, Datadog

## 👨‍🔧 Install

### 🔧 Step 1: Setting Up Services
The goal of this step is to setup the required services for the FYI application, and populate the files in the `config` directory.

  1. Create a secrets file
      1. In your terminal, go to the `config` directory
      2. Run `cp secrets.json.example secrets.json`
  2. Create a web proxy url
      1. Go to `https://smee.io/`
      2. Start a new channel
      3. In `secrets.json`, copy this smee channel url as the value for `webhook-proxy-url`
  3. Create a Github Org
      0. _Note: In case you already have a organization, you can skip the next step_
      1. Go to `https://github.com/organizations/new` to start a new organization
      2. In `default.js`, add your org name to the `github.subscribedOrgs` list & `github.adminOrg`
  4. Create a Github App
      1. Go to `https://github.com/settings/apps/new` and create a new Github App
      2. Set `Webhook URL` to the webhook proxy url from above
      3. Set `Webhook secret` to `development`
      4. In `secrets.json`, copy the GitHub private key as the value for `github-private-key`
      5. Update your Github App's permissions:
          1. Read Only permission for: Repo Administration, Repo Metadata, Repo Webhooks, Commit Statuses, Org Members
          2. Read and Write permission for: Checks, Repository Contents, Issues, Pull Requests,
      6. Updates your Github Apps' event subscriptions:
          1. Subscribe to events for: Repository, Issues, Issue Comments
  5. Create a FYI Admin repository
      1. Go to `https://github.com/new` and create a new repository in your organization called `fyi-admin`
  6. Create a Confluence Space and Page
      1. TODO
  7. Configure Slack channel (optional)
      0. If you want to disable slack, update `default.js` for `slack.enabled` to be `false`
      1. Install "Incoming Webhooks" for your Slack instance
      2. Add a configuration for new incoming webhook for posting to your Slack channel
      3. In `secrets.json`, copy the Slack webhook url as the value for `slack-webhook-url`
      4. In `default.js`, set the channel name as value for `slack.channel`
  8. Configure Datadog events (optional)
      1. Not Supported - This integration has a very custom setup and is not currently supported.

### 🏃 Step 2: Running With Docker (recommended)

  0. Pre-requisites: Docker and Docker Compose
  1. Build Docker Image: `docker build -t easy-fyi-image .`
  2. Run Application: `docker-compose up`
  3. Open your browser and go to `http://localhost:4001`

### 🚶 Running Without Docker

  0. Pre-requisites: Node v9+, Postgres SQL v10+
  1. Create database called `easy-fyi-development`
  1. `npm i`
  2. `npm run install:client`
  3. `npm start`
  4. Open your browser and go to `http://localhost:3001`

## 🚀 Usage

### 🆕 Creating a new FYI
TODO

### 🔀 Adding a dependency to FYI
TODO

### 🈁 Adding a Repository to FYI
TODO

### ℹ️ Alerts for New Repository creation
TODO

## 🙏 Thanks

TODO

## 👨‍🏭 Contributors

See the list of [contributors](https://github.com/CondeNast/fyi/contributors) who participated in writing this tool.

# FYI Architecture Diagrams

Discover and Explore your Organization's System Architecture

## Introduction

The FYI application was built by the Architecture Team at Condé Nast to stay on top of their growing technology portfolio of systems (sites, apps, apis) distributed across hundreds of repositories in multiple GitHub organizations.

This application has two parts:

  - a Github App (called Arch Bot) for automated repository-based system discovery workflow
  - a Frontend App (called Easy FYI) for interactive architecutre diagrams with system dependencies and metrics

[Demo Video Here]

### Built Using

  1. Probot (Github App Framework)
  2. Create React App
  3. Postgres SQL
  4. Vault
  5. Integrations with: Confluence, Slack, Datadog


## How it works

  1. How Arch Bot Works
  2. How Easy FYI works

[Architecture Diagram here]

## Installation

### Development

  1. Setup and Configuration
      1. Setup SMEE
      2. Setup Github Org and Github App
      3. Setup Confluence Space and Page
      4. Setup Slack (optional)
      5. Setup Datadog (optional)
  2. Update config and secrets
  3. Build
      - `docker build -t easy-fyi-image .`
  4. Run
      - `docker-compose up`

### Production
...

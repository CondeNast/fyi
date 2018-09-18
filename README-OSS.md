# FYI Architecture Diagrams

Discover and Explore your Organization's System Architecture

## Introduction

The FYI application was built by the Architecture Team at Condé Nast to stay on top of the company's growing technology portfolio of systems spread across hundreds of Github repositories in multiple Github organizations being developed daily by hundreds of developers.

This application has two parts:

  - a Github App (called Arch Bot) for automated repository-based system discovery
  - a Frontend App (called Easy FYI) to create and view system dependencies and metrics

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
  2. Update config and secrets
  3. Build
    - `docker build -t easy-fyi-image .`
  4. Run
    - `docker-compose up`

### Production
...

const { Application } = require('probot')
const plugin = require('../robot')
const models = require('../models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../services/slack')

const githubIssue = require('../tests/fixtures/github-issue')
const fyiModel = require('../tests/fixtures/fyi-model')

let app = new Application()
app.load(plugin)

let githubMock = {
  issues: {
    create: jest.fn().mockReturnValue(Promise.resolve(githubIssue)),
    edit: jest.fn().mockReturnValue(Promise.resolve({})),
    addLabels: jest.fn().mockReturnValue(Promise.resolve({})),
    removeLabel: jest.fn().mockReturnValue(Promise.resolve({})),
    createComment: jest.fn().mockReturnValue(Promise.resolve({})),
    deleteComment: jest.fn().mockReturnValue(Promise.resolve({})),
    deleteLabel: jest.fn().mockReturnValue(Promise.resolve({})),
    set: jest.fn().mockReturnValue(Promise.resolve({})),
    get: jest.fn().mockReturnValue(Promise.resolve(githubIssue))
  }
}
app.auth = () => Promise.resolve(githubMock)

let eventMock = jest.spyOn(Event, 'create')
eventMock.mockImplementation(() => true)

let fyiMock = jest.spyOn(Fyi, 'forName')
fyiMock.mockImplementation(() => fyiModel)

let slackMock = jest.spyOn(slack, 'post')
slackMock.mockImplementation(() => true)

module.exports = {
  app,
  github: githubMock
}

const { Application } = require('probot')
const plugin = require('../../app')
const models = require('../../src/models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../src/services/slack')

const githubIssue = require('./fixtures/github-issue')
const fyiModel = require('./fixtures/fyi-model')

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
    get: jest.fn().mockReturnValue(Promise.resolve(githubIssue)),
    addAssigneesToIssue: jest.fn().mockReturnValue(Promise.resolve({}))
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

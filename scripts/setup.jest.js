require('dotenv').config()
const { Application } = require('probot')
const plugin = require('../robot')
const githubIssue = require('../tests/fixtures/github-issue')

const models = require('../models')
const Event = models.Event
const Fyi = models.Fyi
const fyiModel = require('../tests/fixtures/fyi-model')
const slack = require('../services/slack')

global.app = new Application()
app.load(plugin)

global.eventMock = jest.spyOn(Event, 'create')
eventMock.mockImplementation(() => true)

global.fyiMock = jest.spyOn(Fyi, 'forName')
fyiMock.mockImplementation(() => fyiModel)

global.slackMock = jest.spyOn(slack, 'post')
slackMock.mockImplementation(() => true)

global.github = {
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

app.auth = () => Promise.resolve(github)

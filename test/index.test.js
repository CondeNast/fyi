const {createRobot} = require('probot')
const app = require('..')
const newRepoCreatedEvent = require('./events/new-repo-created')
const newCommentCreatedEvent = require('./events/new-comment-created')
const models = require('../models')

describe('arch-bot', () => {
  let robot
  let github

  beforeEach(() => {
    robot = createRobot()
    app(robot)
    github = {
      issues: {
        create: jest.fn().mockReturnValue(Promise.resolve({})),
        addLabels: jest.fn().mockReturnValue(Promise.resolve({})),
        createComment: jest.fn().mockReturnValue(Promise.resolve({})),
        deleteComment: jest.fn().mockReturnValue(Promise.resolve({})),
        deleteLabel: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    }
    robot.auth = () => Promise.resolve(github)
  })

  afterAll(async () => {
    await models.sequelize.close();
  })

  describe('new repo created', () => {
    it('creates an issue in fyi repo', async () => {
      await robot.receive(newRepoCreatedEvent)
      expect(github.issues.create).toHaveBeenCalledWith(expect.objectContaining({
        repo: 'fyis',
        title: 'Approve FYI request for new repo: my-awesome-project',
        body: expect.stringMatching(/Repository Name: my-awesome-project\nCreated By: awesome-coder/) && expect.stringMatching(/\n\n<!-- probot = {"1":{"repoName":"my-awesome-project","repoSenderLogin":"awesome-coder"}} -->/),
        labels: ['pending-approval'],
        assignees: ['johnkpaul', 'gautamarora']
      }))
    })
  })
  describe('fyi request approval', () => {
    it('creates an issue in new repo', async () => {
      await robot.receive(newCommentCreatedEvent)
      // create issue in new repo
      expect(github.issues.create).toHaveBeenCalledWith(expect.objectContaining({
        repo: 'my-awesome-project',
        title: 'Add FYI for this repo',
        assignee: 'awesome-coder'
      }))
      // udpate fyis repo
      expect(github.issues.deleteLabel).toHaveBeenCalledWith(expect.objectContaining({
        name: 'pending-approval'
      }))
      expect(github.issues.addLabels).toHaveBeenCalledWith(expect.objectContaining({
        repo: 'fyis',
        labels: ['hal', 'pending-completion']
      }))
      expect(github.issues.deleteComment).toHaveBeenCalledWith(expect.objectContaining({
        repo: 'fyis',
        comment_id: 12
      }))
      expect(github.issues.createComment).toHaveBeenCalledWith(expect.objectContaining({
        repo: 'fyis',
        body: '@gautamarora approved the request for FYI'
      }))
    })
  })
})

const {createRobot} = require('probot')
const app = require('..')
const newRepoCreatedEvent = require('../test/events/new-repo-created')
const newCommentCreatedApproveEvent = require('../test/events/new-comment-created-approve')
// const newCommentCreatedSkipEvent = require('./events/new-comment-created-skip')
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
        edit: jest.fn().mockReturnValue(Promise.resolve({})),
        addLabels: jest.fn().mockReturnValue(Promise.resolve({})),
        createComment: jest.fn().mockReturnValue(Promise.resolve({})),
        deleteComment: jest.fn().mockReturnValue(Promise.resolve({})),
        deleteLabel: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    }
    robot.auth = () => Promise.resolve(github)
  })

  afterAll(async () => {
    return models.sequelize.close()
  })

  describe('new repo created', () => {
    it('logs the new repo created event to the event table', async () => {
      let testActor = 'Actor' + (new Date()).toString()
      newRepoCreatedEvent.payload.sender.login = testActor
      await robot.receive(newRepoCreatedEvent)

      let [mostRecentEvent] = await models.Event.findAll({limit: 1, order: [['createdAt', 'DESC']]})

      expect(mostRecentEvent.get('actor')).toBe(testActor)
    })
  })
  describe('fyi request approval', () => {
    it('logs the approval to the event table', async () => {
      await robot.receive(newCommentCreatedApproveEvent)

      let [mostRecentEvent] = await models.Event.findAll({limit: 1, order: [['createdAt', 'DESC']]})

      expect(mostRecentEvent.get('event')).toBe(models.Event.event_types['fyi_requested_via_github'])
    })
  })
})

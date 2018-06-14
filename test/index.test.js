const {createRobot} = require('probot')
const app = require('..')
const newRepoCreatedEvent = require('./events/new-repo-created')
const newCommentCreatedEvent = require('./events/new-comment-created')

describe('arch-bot', () => {
  let robot
  let github

  beforeEach(() => {
    robot = createRobot()
    app(robot)
    github = {
      issues: {
        create: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    }
    robot.auth = () => Promise.resolve(github)
  })

  describe('new repo created', () => {
    it('creates an issue in fyi repo', async () => {
      await robot.receive(newRepoCreatedEvent)
      expect(github.issues.create).toHaveBeenCalledWith({
        number: undefined,
        owner: 'CondeNast',
        repo: 'fyis',
        title: 'Request FYI for new repo: testing-things'
      })
    })
  })
  describe('new comment created', () => {
    it('creates an issue in fyi repo', async () => {
      await robot.receive(newCommentCreatedEvent)
      expect(github.issues.create).toHaveBeenCalledWith({
        number: undefined,
        owner: 'CondeNast',
        repo: 'fyis',
        title: 'Request FYI for new repo: testing-things'
      })
    })
  })
})

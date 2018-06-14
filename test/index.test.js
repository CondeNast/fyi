const {createRobot} = require('probot')
const app = require('..')
const payload = require('./fixtures/payload')

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
      await robot.receive(payload)
      expect(github.issues.create).toHaveBeenCalledWith({
        number: undefined,
        owner: 'CondeNast',
        repo: 'fyis',
        title: 'Request FYI for new repo: testing-things'
      })
    })
  })
})

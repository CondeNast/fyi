const { Application } = require('probot')
const plugin = require('../../app')
const repoCreatedEvent = require('./repo-created')
const fyiAcceptedEvent = require('./fyi-accepted')
const models = require('../../src/models')

describe('Arch Bot', () => {
  let app
  let github

  beforeEach(() => {
    app = new Application()
    app.load(plugin)
    github = {
      issues: {
        create: jest.fn().mockReturnValue(Promise.resolve({})),
        edit: jest.fn().mockReturnValue(Promise.resolve({})),
        addLabels: jest.fn().mockReturnValue(Promise.resolve({})),
        createComment: jest.fn().mockReturnValue(Promise.resolve({})),
        deleteComment: jest.fn().mockReturnValue(Promise.resolve({})),
        removeLabel: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    }
    app.auth = () => Promise.resolve(github)
  })

  afterAll(async () => {
    return models.sequelize.close()
  })

  describe('Repo Created', () => {
    it('Logs the Repo Created event to the Event table', async () => {
      let testActor = 'Actor' + (new Date()).toString()
      repoCreatedEvent.payload.sender.login = testActor
      await app.receive(repoCreatedEvent)

      let [mostRecentEvent] = await models.Event.findAll({limit: 1, order: [['createdAt', 'DESC']]})

      expect(mostRecentEvent.get('actor')).toBe(testActor)
    })
  })
  // describe('FYI Requested', () => {
  //   it('Logs the FYI Request to the Event table', async () => {
  //     await app.receive(fyiAcceptedEvent)
  //
  //     let [mostRecentEvent] = await models.Event.findAll({limit: 1, order: [['createdAt', 'DESC']]})
  //
  //     expect(mostRecentEvent.get('event')).toBe(models.Event.event_types['fyi_requested_via_github'])
  //   })
  // })
})

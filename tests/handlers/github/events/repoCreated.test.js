const { Application } = require('probot')
const plugin = require('../../../../robot')
const repoCreatedEvent = require('../../../fixtures/repo-created')
const models = require('../../../../models')
const Event = models.Event

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('Repository Created', () => {
    it('Creates an Issue in Admin Repository', async () => {
      await app.receive(repoCreatedEvent)
      expect(github.issues.create).toMatchSnapshot()
      expect(Event.create).toMatchSnapshot()
    })
  })
})

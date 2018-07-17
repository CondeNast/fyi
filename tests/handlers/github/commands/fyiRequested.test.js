const { Application } = require('probot')
const plugin = require('../../../../robot')
const fyiRequestedEvent = require('../../../fixtures/fyi-requested')
const models = require('../../../../models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../../../services/slack')

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('FYI Requested', () => {
    it('Creates an Issue in Repo Repository', async () => {
      await app.receive(fyiRequestedEvent)
      expect(github.issues.removeLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(Fyi.forName).toMatchSnapshot()
      expect(github.issues.create).toMatchSnapshot()
      expect(github.issues.createComment).toMatchSnapshot()
      expect(slack.post).toMatchSnapshot()
      expect(Event.create).toMatchSnapshot()
    })
  })
})

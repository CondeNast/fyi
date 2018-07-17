const { Application } = require('probot')
const plugin = require('../../../../robot')
const fyiAcceptedEvent = require('../../../fixtures/fyi-accepted')
const models = require('../../../../models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../../../services/slack')

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('FYI Requested', () => {
    it('Closes Issue in Admin Repository', async () => {
      await app.receive(fyiAcceptedEvent)
      expect(github.issues.removeLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
      expect(Fyi.forName).toMatchSnapshot()
      expect(slack.post).toMatchSnapshot()
    })
  })
})

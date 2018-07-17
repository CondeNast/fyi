const { Application } = require('probot')
const plugin = require('../../../../robot')
const fyiSkippedEvent = require('../../../fixtures/fyi-skipped')
const models = require('../../../../models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../../../services/slack')

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('FYI Skipped', () => {
    it('Closes Issue in Admin Repository', async () => {
      await app.receive(fyiSkippedEvent)
      expect(github.issues.removeLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(github.issues.createComment).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
    })
  })
})

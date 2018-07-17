const { Application } = require('probot')
const plugin = require('../../../../robot')
const fyiClosedEvent = require('../../../fixtures/fyi-closed')
const models = require('../../../../models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../../../services/slack')

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('FYI Closed', () => {
    it('Closes Issue in Admin Repository', async () => {
      await app.receive(fyiClosedEvent)
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
    })
  })
})

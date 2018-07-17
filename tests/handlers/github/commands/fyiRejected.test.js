const { Application } = require('probot')
const plugin = require('../../../../robot')
const fyiRejectedEvent = require('../../../fixtures/fyi-rejected')
const models = require('../../../../models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../../../services/slack')

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('FYI Rejected', () => {
    it('Re-opens Issue in Repo Repository', async () => {
      await app.receive(fyiRejectedEvent)
      expect(github.issues.createComment).toMatchSnapshot()
      expect(github.issues.removeLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
      expect(github.issues.createComment).toMatchSnapshot()
    })
  })
})

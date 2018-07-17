const { Application } = require('probot')
const plugin = require('../../../../robot')
const fyiReminderEvent = require('../../../fixtures/fyi-reminder')
const models = require('../../../../models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../../../services/slack')

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('FYI Reminder', () => {
    it('Posts Comment for Issue in Repo Repository', async () => {
      await app.receive(fyiReminderEvent)
      expect(github.issues.createComment).toMatchSnapshot()
    })
  })
})

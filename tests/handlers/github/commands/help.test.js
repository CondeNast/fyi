const { Application } = require('probot')
const plugin = require('../../../../robot')
const helpEvent = require('../../../fixtures/help')
const models = require('../../../../models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../../../services/slack')

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('Help', () => {
    it('Posts Comment in Issue in Admin Repository', async () => {
      await app.receive(helpEvent)
      expect(github.issues.createComment).toMatchSnapshot()
    })
  })
})

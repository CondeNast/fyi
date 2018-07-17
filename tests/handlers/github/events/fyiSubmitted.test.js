const { Application } = require('probot')
const plugin = require('../../../../robot')
const fyiSubmittedEvent = require('../../../fixtures/fyi-submitted')
const models = require('../../../../models')
const Fyi = models.Fyi

describe('Arch Bot', () => {
  afterAll(async () => {
    await models.sequelize.close()
  })

  describe('FYI Submitted', () => {
    it('Creates a Comment in Admin Repository', async () => {
      await app.receive(fyiSubmittedEvent)
      expect(github.issues.removeLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(github.issues.createComment).toMatchSnapshot()
      expect(Fyi.forName).toMatchSnapshot()
    })
  })
})

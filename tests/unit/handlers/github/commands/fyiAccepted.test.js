const fyiAcceptedEvent = require('../../../fixtures/fyi-accepted')
const fyiAcceptedLegacyEvent = require('../../../fixtures/fyi-accepted-legacy')
const models = require('../../../../../src/models')
const Fyi = models.Fyi
const slack = require('../../../../../src/services/slack')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
  })

  describe('FYI Accepted', () => {
    it('Closes Issue in Admin Repository', async () => {
      await app.receive(fyiAcceptedEvent)
      expect(github.issues.removeLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
      expect(Fyi.forName).toMatchSnapshot()
      expect(slack.post).toMatchSnapshot()
    })

    it('[Legacy] Closes Issue in Admin Repository - no fyiName in repo issue body', async () => {
      await app.receive(fyiAcceptedLegacyEvent)
      expect(github.issues.removeLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
      expect(Fyi.forName).toMatchSnapshot()
      expect(slack.post).toMatchSnapshot()
    })

  })

  afterAll(async () => {
    await models.sequelize.close()
  })
})

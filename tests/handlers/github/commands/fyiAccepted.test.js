const fyiAcceptedEvent = require('../../../fixtures/fyi-accepted')
const models = require('../../../../models')
const Fyi = models.Fyi
const slack = require('../../../../services/slack')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
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

  afterAll(async () => {
    await models.sequelize.close()
  })
})

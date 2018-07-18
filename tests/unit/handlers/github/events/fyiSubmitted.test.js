const fyiSubmittedEvent = require('../../../fixtures/fyi-submitted')
const models = require('../../../../../src/models')
const Fyi = models.Fyi

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
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

  afterAll(async () => {
    await models.sequelize.close()
  })
})

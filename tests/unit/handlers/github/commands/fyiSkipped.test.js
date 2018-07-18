const fyiSkippedEvent = require('../../../fixtures/fyi-skipped')
const models = require('../../../../../src/models')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
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

  afterAll(async () => {
    await models.sequelize.close()
  })
})

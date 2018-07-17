const fyiRejectedEvent = require('../../../fixtures/fyi-rejected')
const models = require('../../../../models')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
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

  afterAll(async () => {
    await models.sequelize.close()
  })
})

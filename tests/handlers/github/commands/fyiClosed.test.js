const fyiClosedEvent = require('../../../fixtures/fyi-closed')
const models = require('../../../../models')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
  })

  describe('FYI Closed', () => {
    it('Closes Issue in Admin Repository', async () => {
      await app.receive(fyiClosedEvent)
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
    })
  })

  afterAll(async () => {
    await models.sequelize.close()
  })
})

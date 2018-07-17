const helpEvent = require('../../../fixtures/help')
const models = require('../../../../models')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
  })

  describe('Help', () => {
    it('Posts Comment in Issue in Admin Repository', async () => {
      await app.receive(helpEvent)
      expect(github.issues.createComment).toMatchSnapshot()
    })
  })

  afterAll(async () => {
    await models.sequelize.close()
  })
})

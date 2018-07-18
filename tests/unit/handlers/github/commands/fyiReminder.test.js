const fyiReminderEvent = require('../../../fixtures/fyi-reminder')
const models = require('../../../../../src/models')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
  })

  describe('FYI Reminder', () => {
    it('Posts Comment for Issue in Repo Repository', async () => {
      await app.receive(fyiReminderEvent)
      expect(github.issues.createComment).toMatchSnapshot()
    })
  })

  afterAll(async () => {
    await models.sequelize.close()
  })
})

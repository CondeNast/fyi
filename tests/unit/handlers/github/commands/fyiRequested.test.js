const fyiRequestedEvent = require('../../../fixtures/fyi-requested')
const models = require('../../../../../src/models')
const Event = models.Event
const Fyi = models.Fyi
const slack = require('../../../../../src/services/slack')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
  })

  describe('FYI Requested', () => {
    it('Creates an Issue in Repo Repository', async () => {
      await app.receive(fyiRequestedEvent)
      expect(github.issues.removeLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
      expect(Fyi.forName).toMatchSnapshot()
      expect(github.issues.create).toMatchSnapshot()
      expect(github.issues.createComment).toMatchSnapshot()
      expect(slack.post).toMatchSnapshot()
      expect(Event.create).toMatchSnapshot()
    })
  })

  afterAll(async () => {
    await models.sequelize.close()
  })
})

const repoCreatedEvent = require('../../../fixtures/repo-created')
const models = require('../../../../models')
const Event = models.Event

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
  })

  describe('Repository Created', () => {
    it('Creates an Issue in Admin Repository', async () => {
      await app.receive(repoCreatedEvent)
      expect(github.issues.create).toMatchSnapshot()
      expect(Event.create).toMatchSnapshot()
    })
  })

  afterAll(async () => {
    await models.sequelize.close()
  })
})

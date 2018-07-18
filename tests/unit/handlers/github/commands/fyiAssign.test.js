const fyiAssignEvent = require('../../../fixtures/fyi-assign')
const models = require('../../../../../src/models')

let app
let github

describe('Arch Bot', () => {
  beforeEach(() => {
    ({app, github} = require('../../../setup.js'))
  })

  describe('FYI Assign', () => {
    it('Assigns Issue to Assignee in Repo Repository', async () => {
      await app.receive(fyiAssignEvent)
      expect(github.issues.addAssigneesToIssue).toMatchSnapshot()
    })
  })

  afterAll(async () => {
    await models.sequelize.close()
  })
})

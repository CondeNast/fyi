require('dotenv').config();
// const { Application } = require('probot')
// const plugin = require('../robot')
// const repoCreatedEvent = require('../tests/fixtures/repo-created')
// const models = require('../models')
// const Event = models.Event
//
// describe('Arch Bot', () => {
//   let app
//   let github
//   let createMock
//   beforeEach(() => {
//     app = new Application()
//     app.load(plugin)
//     createMock = jest.spyOn(Event, 'create')
//     createMock.mockImplementation(() => true)
//     github = {
//       issues: {
//         create: jest.fn().mockReturnValue(Promise.resolve({})),
//         edit: jest.fn().mockReturnValue(Promise.resolve({})),
//         addLabels: jest.fn().mockReturnValue(Promise.resolve({})),
//         createComment: jest.fn().mockReturnValue(Promise.resolve({})),
//         deleteComment: jest.fn().mockReturnValue(Promise.resolve({})),
//         deleteLabel: jest.fn().mockReturnValue(Promise.resolve({}))
//       }
//     }
//     app.auth = () => Promise.resolve(github)
//   })
//
//   afterAll(async () => {
//     createMock.mockRestore()
//     await models.sequelize.close()
//   })
// })

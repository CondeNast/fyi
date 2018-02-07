// async fetchData = () => {
//
// }
const rp = require('request-promise-native');

describe('Fyi API',  () => {
  test('POST of a new FYI returns the same from GET', async ()=> {
    let newFyi = {
      title: 'New Title 1' + new Date(),
      description: 'New Description 1'
    };

    await rp({
      method: 'post',
      uri: 'http://localhost:3000/api/v1/fyis',
      body: {
        Fyi: newFyi
      },
      json: true
    });

    let res = await rp.get('http://localhost:3000/api/v1/fyis');

    let newestRecord = JSON.parse(res)["Fyis"].reverse()[0];

    expect(newestRecord).toMatchObject(newFyi);
  })
})

// async fetchData = () => {
//
// }
const rp = require('request-promise-native');

describe('testing',  () => {
  test('hello',async ()=> {
    //await expect(fetchData()).resolves.toBe('peanut butter');
    let res = await rp.get('http://localhost:3000/api/v1/fyis');
    expect(res).toMatchSnapshot();
    // expect()
  })
})

const express = require('express')
const bodyParser = require('body-parser');
const rp = require('request-promise-native');
const app = express()

const CNVault = require('@condenast/cn-vault');
const CONFLUENCE_SECRET_KEY = 'secret/architecture/easy-fyi';

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

CNVault.getInstance()
  .getSecrets([CONFLUENCE_SECRET_KEY]).then(([confluenceSecrets]) => {

  app.get('/', function (req, res) {
    const models = require('./db/models');
    const options = {
      url: 'https://cnissues.atlassian.net/wiki/rest/api/content/search?cql=parent=123212691&limit=200&expand=body.storage',
      json: true,
    }

    models.Fyi.destroy({
        where: {},
          truncate: true
    }).then(function(){

      rp.get(options).auth(confluenceSecrets['confluence-username'], confluenceSecrets['confluence-access-token']).then(data => {

        asyncForEach(data.results, fyi => {
          //console.log(fyi)
        
          return models.Fyi.create({
              title: fyi.title,
              description: fyi.body.storage.value
          });
        })

      }, err => console.error(err))
    });

    res.render('index');
  });

  app.get('/ping', function (req, res) {
    res.render('index');
  });

  app.post('/create-fyi', function (req, res) {
    const options = {
      url: 'https://cnissues.atlassian.net/wiki/rest/api/content/',
      json: true,
      body: {
          "type": "page",
          "title": req.body.name,
          "ancestors": [{
              "id": 123212691
          }],
          "space": {
              "key": "ARCH"
          },
          "body": {
              "storage": {
                  "value":req.body.content,
                  "representation": "storage"
              }
          }
      }
    }
    rp.post(options).auth(confluenceSecrets['confluence-username'], confluenceSecrets['confluence-access-token'])
    res.render('success');
  });

    
  const port = process.env.NODE_PORT || 3000;
  app.listen(port, () => console.log('easy-fyi app listening on port ' + port))

});

async function asyncForEach(array, callback) {
  let funcs = [];
  for( let i = 0; i < array.length; i++ ){
    funcs.push( () => callback(array[i]) )  
  }
  funcs.reduce((promise, func) =>
                   promise.then(result => func().then(Array.prototype.concat.bind(result))),
                   Promise.resolve([])).then(() => {})
                   .catch(console.error.bind(console))

}

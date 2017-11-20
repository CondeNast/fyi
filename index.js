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
    console.log(confluenceSecrets)

  app.get('/', function (req, res) {
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

    
  app.listen(3000, () => console.log('easy-fyi app listening on port 3000!'))

});

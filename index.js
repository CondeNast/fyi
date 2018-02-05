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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const { createController } = require('sequelize-rest-handlers');
const models = require('./db/models');
const router = createController(models.Fyi, {
  //overrideOutputName: 'data'
});
app.use('/api/v1/fyis', router);

CNVault.getInstance()
  .getSecrets([CONFLUENCE_SECRET_KEY]).then(([confluenceSecrets]) => {

  app.get('/', function (req, res) {

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


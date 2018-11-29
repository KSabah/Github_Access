const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));

var github = require('octonode');
var client = github.client();

app.listen(3000, function () {
});

app.get('/', function (req, res) {
  res.render('index', {repos: null, error: null});
})

app.post('/', function (req, res) {
  var array = [];
  var repos = [];
  let username = req.body.username;
  var ghuser = client.user(username);
  ghuser.repos((function(err, data, headers) {
    for(var i in data) {
      if(data.hasOwnProperty(i)) {
        array.push(data[i].name);
      }
    }
    repos = getCommits(username, array);
    repos.then(function(result) {
      res.render('index', {repos: result, error: null});
    })
  }));
})

async function getCommits (username, repos) {
  var data = []
  for (var i = 0; i < repos.length; i++){
    var res = await client.getAsync('/repos/'+username+'/'
                    +repos[i]+'/contributors', {});
    data[i] = repos[i]+' : '+ res[1][0].contributions;
  }
  return data;
}

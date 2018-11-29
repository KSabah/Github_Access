const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));

var github = require('octonode');
var client = github.client('b1b83ad97df0ab2d1a2ec02a90a3194440ef6d72');

app.listen(3000, function () {
});

app.get('/', function (req, res) {
  res.render('index', {repos: null, error: null});
})

app.post('/', function (req, res) {
  let username = req.body.username;
  var ghuser = client.user(username);
  ghuser.repos((function(err, data, headers) {
    for(var i in data) {
      if(data.hasOwnProperty(i)) {
        var repoName = data[i].name;
        let repos = getCommits(username, repoName);
        repos.then(function(result) {
          res.render('index', {repos: result, error: null});
        })
      }
    }
  }));
})

async function getCommits (username, repoName) {
  var res = await client.getAsync('/repos/'+username+'/'
                  +repoName+'/contributors', {});
  var data = repoName+' : '+ res[1][0].contributions;
  return data;
}

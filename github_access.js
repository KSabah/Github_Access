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

app.post('/', function (req, res) {
  let username = req.body.username;
  var ghuser = client.user(username);
  ghuser.repos((function(err, data, headers) {
    for(var i in data) {
      if(data.hasOwnProperty(i)) {
        var repoName = data[i].name;
        var text = getCommits(username, repoName);
        text.then(function(result) {
        console.log(result) //will log results.
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

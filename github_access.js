const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));

var github = require('octonode');
var client = github.client();

var fs = require('fs');

app.listen(3000, function () {
});

app.get('/', function (req, res) {
  res.render('index');
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
    res.render('index');
  }));
})

async function getCommits (username, repos) {
  var data = [];
  var parsedData = [];
  for (var i = 0; i < repos.length; i++){
    var res = await client.getAsync('/repos/'+username+'/'
                    +repos[i]+'/contributors', {});
    data[i] = repos[i]+':'+ res[1][0].contributions;
  }
  if (fs.existsSync('./public/data.csv')){
    fs.appendFileSync('./public/data.csv','name,contributions\n');
    for (var i = 0; i < data.length; i++){
       parsedData = data[i].split(":");
       fs.appendFileSync('./public/data.csv',parsedData[0]+','+parsedData[1]+'\n');
    }
  }
  else {
    fs.appendFileSync('./public/data.csv','name,contributions\n');
      for (var i = 0; i < data.length; i++){
         parsedData = data[i].split(":");
         fs.appendFileSync('./public/data.csv',parsedData[0]+','+parsedData[1]+'\n');
    }
  }
}

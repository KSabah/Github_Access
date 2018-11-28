var github = require('octonode');
var client = github.client();
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What user would you like info on? ',(answer) =>
{
  var ghuser = client.user(answer);
  ghuser.repos((function(err, data, headers) {
    for(var i in data) {
      if(data.hasOwnProperty(i)){
        var repoName = data[i].name;
        getCommits(answer, repoName);
      }
   }
 }));
rl.close();
});

async function getCommits (answer, repoName) {
  var res = await client.getAsync('/repos/'+answer+'/'+repoName+'/contributors', {});
  console.log(repoName+' : '+ res[1][0].contributions)
}

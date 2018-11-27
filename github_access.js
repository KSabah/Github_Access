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
    console.log("data: " + JSON.stringify(data));
    /*Uncomment to view errors and headers
    console.log("error: " + err);
    console.log("headers:" + headers);
    */
  }));
  rl.close();
});

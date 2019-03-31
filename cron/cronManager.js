var cron = require('node-cron');
 
console.log('[INFO] cron job is started ...')

// run provider every 11:00
cron.schedule('0 12 * * *', function(){
  var shell = require('./childHelper');
  var commandList = ["yarn provider"]
  shell.series(commandList , function(err){
      console.log('Provider job done ... ')
  });
});

// run provider every 14:36
cron.schedule('0 14 * * *', function(){
  var shell = require('./childHelper');
  var commandList = ["yarn consumer"]
  shell.series(commandList , function(err){
      console.log('Consumer job done ... ')
  });
});

// run history every 16:00
cron.schedule('0 18 * * *', function(){
  var shell = require('./childHelper');
  var commandList = ["node script/updateHistory.js"]
  shell.series(commandList , function(err){
      console.log('update history job done ... ')
  });
});

cron.schedule('30 * * * *', function(){
  var shell = require('./childHelper');
  var commandList = ["curl https://zd-web.herokuapp.com/"]
  shell.series(commandList , function(err){
      console.log('wake up heroku ... ')
  });
});

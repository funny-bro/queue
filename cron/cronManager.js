var cron = require('node-cron');
 
console.log('[INFO] cron job is started ...')

// run provider every 11:00
cron.schedule('0 11 * * *', function(){
  var shell = require('./childHelper');
  var commandList = ["yarn provider"]
  shell.series(commandList , function(err){
      console.log('Provider job done ... ')
  });
});

// run provider every 13:00
cron.schedule('0 13 * * *', function(){
  var shell = require('./childHelper');
  var commandList = ["yarn consumer"]
  shell.series(commandList , function(err){
      console.log('Consumer job done ... ')
  });
});
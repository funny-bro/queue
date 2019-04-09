var cron = require('node-cron');
 
console.log('[INFO] cron job is started ...')


const PROVIDER_CRON = '0 11 * * *'
const CONSUMER_CRON = '45 08 * * *'
const HISTORY_CRON = '0 18 * * *'

console.log('[INFO] provider cron: ', PROVIDER_CRON)
console.log('[INFO] consumer cron: ', CONSUMER_CRON)
console.log('[INFO] auth cron: ', HISTORY_CRON)

// run provider every 11:00
cron.schedule(PROVIDER_CRON, function(){
  var shell = require('./childHelper');
  var commandList = ["yarn provider"]
  shell.series(commandList , function(err){
      console.log('Provider job done ... ')
  });
});

// run provider every 14:00
cron.schedule(CONSUMER_CRON, function(){
  var shell = require('./childHelper');
  shell.series(["yarn consumer"] , function(err){
      console.log('Consumer-1 job done ... ')
      shell.series(["yarn consumouer:nat"] , function(err){
          console.log('Consumer-nat job done ... ')
      });
  });
});

// run history every 16:00
cron.schedule(HISTORY_CRON, function(){
  var shell = require('./childHelper');
  var commandList = ["node script/updateHistory.js"]
  shell.series(commandList , function(err){
      console.log('update history job done ... ')
  });
});

// cron.schedule('30 * * * *', function(){
//   var shell = require('./childHelper');
//   var commandList = ["curl https://zd-web.herokuapp.com/"]
//   shell.series(commandList , function(err){
//       console.log('wake up heroku ... ')
//   });
// });

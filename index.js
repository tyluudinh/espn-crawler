var StoryService = require('./story');
var VideoService = require('./videos');

var moment = require('moment');

var schedule = require('node-schedule');


var rule = new schedule.RecurrenceRule();
rule.minute = 30;

var j = schedule.scheduleJob(rule, function(){
  console.log(`<<<<<<<<<<<<<< Start Job at ${moment().format('YYYY-MM-DD HH:MM:ss')} >>>>>>>>>>>>>>>>>>>>>`);

  StoryService.init();
  StoryService.init('headlines');
  VideoService.init();
  VideoService.getByIdFromStoryModel();

});

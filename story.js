var utils = require('./utils');
var {api} = require('./request');
var cheerio = require('cheerio');
var Story = require('./models/story');
var StoryHelper = require('./helper/story');

const STORY_TYPE = StoryHelper.TYPE;
const LEAGES = [
  'uefa.champions',
  'fifa.world',
  'fra.1',
  'ger.1',
  'ita.1',
  'eng.1',
  'eng.fa',
  'esp.1',
  'uefa.euro',
  'uefa.europa'
]
var resultsCount = 0;

module.exports = {
  init: (type) => {
    LEAGES.map((league) => {
      var url = `sports/soccer/${league}/news`;
      if (type === 'headlines'){
         url = `sports/soccer/${league}/news/headlines`;
      }
      api(url, {}, (res) => {
        if (res.resultsCount !== undefined){
            resultsCount = res.resultsCount;
            console.log(`++++++++++++++++++++++++++ Leage: ${league} ++++++++++++++++++++++++++`);
            console.log(`Total Page: ${resultsCount - 1 }`);
            requestData(url, 0, resultsCount);
        }
      });
    })
  }
}

var requestData = (url, i, resultsCount) => {
  if (i === 0) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Start get headlines <<<<<<<<<<<<<<<<<<<<<<<<<<");
  }

  if (i === resultsCount){
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> End get headlines <<<<<<<<<<<<<<<<<<<<<<<<<<");
    return false;
  }
  api(url, {offset: i}, (res) => {
    console.log(`--------------------- GET Page ${i} Successfully ---------------------`);
    var headlines = res.headlines;
    if (headlines !== undefined && headlines.length > 0){
      headlines.map((story) => {
        if (story.type === STORY_TYPE){
          setModel(story);
        }
      });
      requestData(url, i + 1, resultsCount);
    }
  });
}


var setModel = (story) => {
  Story.findOne(story.id, (err, res) => {
    if (res.length === 0){
      var model = {};
      model.story = StoryHelper.modifineStoryContent(story);
      model.published = utils.setPublished(story.published);
      model.thumbnail = StoryHelper.setThumbnail(story);
      model.title = story.title;
      model.espn_story_id = story.id;
      model.tags = story.keywords.join();
      model.description = story.description;
      model.espn_video_id = StoryHelper.setVideoId(story);
      Story.insert(model, (error, result) => {
        if (error === null){
          console.log(`Inserted 1 record into table story with espn_story_id = ${model.espn_story_id}`);
        }
      })
    }
  })

}

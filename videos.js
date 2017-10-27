var utils = require('./utils');
var {api} = require('./request');
var Video = require('./models/video');

var Story = require('./models/story');

const URL = 'video/soccer/clips'

module.exports = {
  init: () => {
    api(url = URL, {}, (res) => {
      if (res.resultsCount !== undefined){
          resultsCount = res.resultsCount;
          console.log(`Total Page: ${resultsCount - 1 }`);
          requestData(url, 0, resultsCount);
      }
    });
  },
  getByIdFromStoryModel: () => {
    Story.findAll((err, res) => {
      if (res && res.length > 0){
        res.map((story) => {
          requestData(`video/clips/${story.espn_video_id}`, 0, 1);
        })
      }
    })
  }
}

var requestData = (url, i, resultsCount) => {
  if (i === 0) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Start get Video <<<<<<<<<<<<<<<<<<<<<<<<<<");
  }

  if (i === resultsCount){
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> End get Video <<<<<<<<<<<<<<<<<<<<<<<<<<");
    return false;
  }
  api(url, {offset: i}, (res) => {
    console.log(`--------------------- GET Page ${i} Successfully ---------------------`);
    var videos = res.videos;
    if (videos !== undefined && videos.length > 0){
      videos.map((video) => {
        setModel(video);
      });
      requestData(url, i + 1, resultsCount);
    }
  });
}


var setModel = (video) => {
  Video.findOne(video.id, (err, res) => {
    if (res.length === 0){
      var model = {};
      model.espn_video_id = video.id;
      model.title = video.headline;
      model.published = utils.setPublished(video.originalPublishDate);
      model.thumbnail = video.thumbnail;
      model.duration = video.duration;
      model.caption = video.caption;
      model.tags = video.keywords.join();
      model.description = video.description;
      model.sources = JSON.stringify(video.links.source);

      Video.insert(model, (error, result) => {
        if (error === null){
          console.log(`Inserted 1 record into table video with espn_video_id = ${model.espn_video_id}`);
        }
      })
    }
  })

}

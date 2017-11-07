var utils = require('./utils');
var {api} = require('./request');
var Video = require('./models/video');

var Story = require('./models/story');
var slugify = require('slug');
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
          if (story.espn_video_id !== null){
            requestData(`video/clips/${story.espn_video_id}`, 0, 1);
          }
        })
      }
    })
  },
  updateTags: () => {
    // Story.findAll((err, res) => {
    //   if (res && res.length > 0){
    //     res.map((story) => {
    //       var content = story.story.replace('&lt;img class=&quot;img-in-content&quot; src=&quot;', '<img class="img-in-content" src="').replace('&quot; /&gt;</photo>', '" /></photo>')
    //       var data = {
    //         story: content
    //       };
    //       Story.update(story.id, data, (err, res) =>{
    //         if (res){
    //           console.log(`Update img success Story id: ${story.id}`);
    //         }
    //       })
    //
    //     })
    //   }
    // });
    Video.findAll((err, res) => {
      if (res && res.length > 0){
        res.map((video) => {
          var tags = video.tags;
          api(`video/clips/${video.espn_video_id}`, {}, (results) => {
            if (results.videos) {
              var vd = results.videos[0];
              var leagueName = vd.tracking.leagueName, coverageType = vd.tracking.coverageType;
              tags = tags + leagueName === undefined ? '' : ','+leagueName +
                coverageType === undefined ? '' : ','+coverageType;
              Video.update(video.id, {tags: tags}, (err, res) =>{
                if (res){
                  console.log(`Update tags success video id: ${video.id}`);
                }
              })
            }
          })
        })
      }
    })
  },
  // updateCategoryAndTag()
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
    console.log(`--------------------- GET Page Video ${i} Successfully ---------------------`);
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
      var model = {}, leagueName = video.tracking.leagueName, coverageType = video.tracking.coverageType;
      var tags = video.keywords.join() + leagueName === undefined ? '' : ','+leagueName;
      tags += coverageType === undefined ? '' : ','+coverageType;
      model.espn_video_id = video.id;
      model.title = video.headline;
      model.published = utils.setPublished(video.originalPublishDate);
      model.thumbnail = video.thumbnail;
      model.duration = video.duration;
      model.caption = video.caption;
      model.tags = tags;
      model.description = video.description;
      model.sources = JSON.stringify(video.links.source);
      model.slug = slugify(video.headline, {lowercase: false});
      Video.insert(model, (error, result) => {
        if (error === null){
          console.log(`Inserted 1 record into table video with espn_video_id = ${model.espn_video_id}`);
        }
      })
    }
  })

}

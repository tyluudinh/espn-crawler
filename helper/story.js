var cheerio = require('cheerio');

module.exports = {
  TYPE: 'Story',

  setVideoId: (story) => {
    var videos = story.video;
    if (videos !== undefined && videos.length > 0){
      return videos[0].id;
    }
    return null;
  },

  setThumbnail: (story) => {
    var images = story.images;
    if (images !== undefined && images.length > 0){
      if (images.length > 1){
        return images[1].url;
      }
      return images[0].url;
    }
    return '';
  },

  modifineStoryContent: (story) => {
    var images = story.images;
    if (images !== undefined && images.length > 0){
      var $ = cheerio.load(story.story);
      $('photo').text('<img class="img-in-content" src="'+images[0].url+'" />');

      var content = $.html();
      content = content.replace('<html><head></head><body>', '');

      content = content.replace('</body></html>', '');

      content = content.replace('&lt;img class=&quot;img-in-content&quot; src=&quot;', '<img class="img-in-content" src="').replace('&quot; /&gt;</photo>', '" /></photo>');

      return content;
    }
    return '';
  },


}

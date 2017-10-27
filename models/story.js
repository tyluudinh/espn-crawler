var BaseModel =  require('./BaseModel');
var moment = require('moment');
let tableName = 'story';

let Story = {
  tableName: tableName,
  findAll: (callback) => {
    BaseModel.query(`SELECT * FROM ${tableName}`, function (err, rows) {
      return callback(err, rows);
    })
  },
  findOne: function(espnId, callback) {
    BaseModel.query(`SELECT * FROM ${tableName} WHERE espn_story_id = ${espnId}`, function (err, rows) {
      return callback(err, rows);
    })
  },
  insert: function (data, callback) {
    BaseModel.query(`INSERT INTO ${tableName} SET ?`, data, function (err, rows) {
      return callback(err, rows);
    })
  },
  update: function (id, data, callback) {
    BaseModel.query(`UPDATE ${tableName} SET ? where id = ${id}`, data, function (err, rows) {
      return callback(err, rows);
    })
  },
  newModel: (appId, date) => {
    return {
      app_id: appId,
      date: date,
      video: 0,
      animated_image: 0,
      rich_media: 0,
      text: 0,
      image: 0
    };
  },
  /**
   *
   * @param appId
   * @param startDate: 20171023
   * @param endDate: 20171023
   * @returns {string}
   */
  url_request: (appId, startDate, endDate) => {
    return `${utils.getEnv('URL_CHART') + appId}/summary_ad_revenue.chart?start_date=${startDate}&end_date=${endDate}&type=standard&collection_id=${appId}`
  }
};

module.exports = Story;

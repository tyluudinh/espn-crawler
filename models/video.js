var BaseModel =  require('./BaseModel');
var moment = require('moment');
let tableName = 'video';

let Video = {
  tableName: tableName,
  findOne: function(espnId, callback) {
    BaseModel.query(`SELECT * FROM ${tableName} WHERE espn_video_id = ${espnId}`, function (err, rows) {
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
  }
};

module.exports = Video;

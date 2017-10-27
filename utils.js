var moment = require('moment');
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

module.exports = {
  setPublished: (published) => {
    return moment(published).utc().format(DATE_TIME_FORMAT);
  },
  DATE_TIME_FORMAT: DATE_TIME_FORMAT,
}

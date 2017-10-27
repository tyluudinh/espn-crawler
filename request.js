var axios = require('axios');

const API_KEY = '5p8m6dw513q716wt2os04mec3';
const ROOT_API_URL = 'http://api.espn.com/v1/';


module.exports = {
  api: (url, params, callback) => {
    if (params === undefined || params === null){
      var params = {};
    }
    params.apikey = API_KEY;
    axios({
      method: 'GET',
      params: params,
      url: ROOT_API_URL + url
    }).then((res) => {
      callback(res.data);
    }).catch((error) => {
      if (error.response) {
        console.log(`=====================>>>>>>>Error<<<<<<<<=======================`);
        console.log(`==============Code: ${error.response.data.code}=================`);

        console.log(`===========Message: ${error.response.data.message}==============`);

        console.log(`===============Url: ${url}======================================`);
        console.log(`================================================================`);
      }
    })
  }
}

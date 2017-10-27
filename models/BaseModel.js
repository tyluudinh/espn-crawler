const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  port     : '8889',
  user     : 'root',
  password : 'root',
  database : 'espn_crawl',
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;

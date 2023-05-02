////////////
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const {newsFile} = require('../news.js')

//Retrieves the config file
const config = require('./config.json');

//Connects to the database
var connection = new Connection(config);

//Inserts the news into the database
function insertNews(news) {

  connection.on('connect', function (error) {
    if (error) {
      console.error('Error connecting to database:', error);
    } else {
      console.log('Connected to database');

      //Creates a new bulk load object
      const bulkLoad = connection.newBulkLoad('news', function (error, rowCount) {
        if (error) {
          console.error('Error inserting rows:', error);
          return;
        }
        console.log('Inserted %d rows', rowCount);
        //Closes the connection
        //connection.close();
      });
    
      //Sets up the table's SCHEMA
      bulkLoad.addColumn('title', TYPES.NVarChar, { length: 255, nullable: true });
      bulkLoad.addColumn('imageUrl', TYPES.NVarChar, { length: 512, nullable: true });
      bulkLoad.addColumn('source', TYPES.NVarChar, { length: 255, nullable: true });
      bulkLoad.addColumn('publishedAt', TYPES.DateTime, { nullable: true });
      bulkLoad.addColumn('author', TYPES.NVarChar, { length: 255, nullable: true });
      bulkLoad.addColumn('url', TYPES.NVarChar, { length: 512, nullable: true });
      bulkLoad.addColumn('description', TYPES.NVarChar, { length: 255, nullable: true });
      

      //Executes the bulk load
      connection.execBulkLoad(bulkLoad, news);
    }
    
  });

  //connection.connect();
}

function insertWeather(weather) {
  
  connection.on('connect', function (error) {
    if (error) {
      console.error('Error connecting to database:', error);
    } else {
      console.log('Connected to database');

      //Finds the data 30 days ago to make sure that there is only 30 days of data in the database
      let today = new Date()
      let dateOneMonthAgo = new Date(new Date().setDate(today.getDate() - 30)).toISOString().slice(0, 10);
      today = today.toISOString().slice(0, 10);

      //deletes the data that is older than 30 days
      let query = `DELETE FROM weather WHERE dateKey < '${dateOneMonthAgo}' OR dateKey >= '${today}'`
      console.log(query)

      // Creates a new request object, meant to run the query deleting the old data
      const request = new Request(query, function (error, rowCount) {
        if (error) {
          console.error('Error deleting rows:', error);
          return;
        }
        console.log('Deleted %d rows', rowCount);
        //Executes the bulk insertion
        connection.execBulkLoad(bulkLoad, weather);
      });

      //Creates a new bulk load object
      const bulkLoad = connection.newBulkLoad('weather', function (error, rowCount) {
        if (error) {
          console.error('Error inserting rows:', error);
          return;
        }
        console.log('Inserted %d rows', rowCount);
        //Closes the connection
        //connection.close();
      });
    
      //Sets up the table's SCHEMA
      bulkLoad.addColumn('datekey', TYPES.Date, { nullable: true });
      bulkLoad.addColumn('temperature', TYPES.Float, { nullable: true });
      bulkLoad.addColumn('sunrise', TYPES.Time, { nullable: true });
      bulkLoad.addColumn('sunset', TYPES.Time, { nullable: true });
      bulkLoad.addColumn('weathercode', TYPES.Int, { nullable: true });
      
      //Executes the requests
      connection.execSql(request);
      //connection.connect();
    }
    
  });
}

//Exports the functions for use in other files
module.exports = {
  insertNews: insertNews,
  insertWeather: insertWeather,
  connection: connection
}
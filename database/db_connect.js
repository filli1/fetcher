////////////
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

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
        connection.close();
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

  connection.connect();
}

function insertWeather(weather) {

  connection.on('connect', function (error) {
    if (error) {
      console.error('Error connecting to database:', error);
    } else {
      console.log('Connected to database');

      //Creates a new bulk load object
      const bulkLoad = connection.newBulkLoad('weather', function (error, rowCount) {
        if (error) {
          console.error('Error inserting rows:', error);
          return;
        }
        console.log('Inserted %d rows', rowCount);
        //Closes the connection
        connection.close();
      });
    
      //Sets up the table's SCHEMA
      bulkLoad.addColumn('datekey', TYPES.Date, { nullable: true });
      bulkLoad.addColumn('temperature', TYPES.Float, { nullable: true });
      bulkLoad.addColumn('sunrise', TYPES.Time, { nullable: true });
      bulkLoad.addColumn('sunset', TYPES.Time, { nullable: true });
      bulkLoad.addColumn('weathercode', TYPES.Int, { nullable: true });
      

      //Executes the bulk load
      connection.execBulkLoad(bulkLoad, weather);
    }
    
  });

  connection.connect();
}

//Exports the functions for use in other files
module.exports = {
  insertNews: insertNews,
  insertWeather: insertWeather
}
//Imports the tedious library
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

//Retrieves the config file
const config = require('./config.json');

// //Connects to the database
// var connection = new Connection(config);

//Inserts the news into the database
function insertNews(news) {
  // The Promise resolves or rejects based on the completion of the asynchronous database operation.
  return new Promise(async (resolve, reject) => {
    //Makes a new connection to the database
    const connection = new Connection(config);

    //When the connection is established
    connection.on('connect', async function (error) {
      if (error) {
        console.error('Error connecting to database:', error);
        reject(error);
      } else {
        console.log('Connected to database');

        try {
          const existingUrls = await getExistingUrls(connection);
          console.log('Existing URLs:', existingUrls)
          const filteredNews = news.filter((article) => !existingUrls.has(article.url));
          //console.log('Filtered news:', filteredNews);

          if (filteredNews.length === 0) {
            console.log('No new articles to insert');
            connection.close();
            resolve();
            return;
          }

           // Creates a new bulk load object
            const options = { keepNulls: true , checkConstraints: true};
            const bulkLoad = connection.newBulkLoad('news', options, function (error, rowCount) {
              if (error) {
                console.error('Error inserting rows:', error);
                reject(error);
              } else {
                console.log('Inserted %d rows', rowCount);
                connection.close();
                resolve();
              }
            });

            // Sets up the database table's SCHEMA
            bulkLoad.addColumn('title', TYPES.NVarChar, { length: 255, nullable: true });
            bulkLoad.addColumn('imageUrl', TYPES.NVarChar, { length: 512, nullable: true });
            bulkLoad.addColumn('source', TYPES.NVarChar, { length: 255, nullable: true });
            bulkLoad.addColumn('publishedAt', TYPES.DateTime, { nullable: true });
            bulkLoad.addColumn('author', TYPES.NVarChar, { length: 255, nullable: true });
            bulkLoad.addColumn('url', TYPES.NVarChar, { length: 512, nullable: true });
            bulkLoad.addColumn('description', TYPES.NVarChar, { length: 255, nullable: true });

            // Executes the bulk load
            connection.execBulkLoad(bulkLoad, filteredNews);
        } catch (error) {
          console.error('Error filtering news articles:', error);
          reject(error);
        }

       
      }
    });

    // Attempts to connect to the database
    connection.connect();
  });
}

function getExistingUrls(connection) {
  return new Promise((resolve, reject) => {
    const existingUrls = new Set();

    const request = new Request('SELECT url FROM news', (error, rowCount) => {
      if (error) {
        reject(error);
      } else {
        resolve(existingUrls);
      }
    });

    request.on('row', (columns) => {
      columns.forEach((column) => {
        existingUrls.add(column.value);
      });
    });

    connection.execSql(request);
  });
}

// insertWeather function takes a weather object and returns a Promise.
function insertWeather(weather) {
  // The Promise resolves or rejects based on the completion of the asynchronous database operation.
  return new Promise(async (resolve, reject) => {
    const connection = new Connection(config);
    connection.on('connect', async function (error) {
      if (error) {
        console.error('Error connecting to database:', error);
        reject(error);
      } else {
        console.log('Connected to database');

        //Finds the data 30 days ago to make sure that there is only 30 days of data in the database
        let today = new Date()
        let dateOneMonthAgo = new Date(new Date().setDate(today.getDate() - 30)).toISOString().slice(0, 10);
        today = today.toISOString().slice(0, 10);

        //deletes the data that is older than 30 days
        let query = `DELETE FROM weather WHERE dateKey < '${dateOneMonthAgo}' OR dateKey >= '${today}'`

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
            reject(error);
          } else {
            console.log('Inserted %d rows', rowCount);
            resolve(rowCount);
          }
          //Closes the connection
          connection.close();
        });
      
        //Sets up the table's SCHEMA
        bulkLoad.addColumn('datekey', TYPES.Date, { nullable: true });
        bulkLoad.addColumn('temperature', TYPES.Float, { nullable: true });
        bulkLoad.addColumn('sunrise', TYPES.Time, { nullable: true });
        bulkLoad.addColumn('sunset', TYPES.Time, { nullable: true });
        bulkLoad.addColumn('weathercode', TYPES.Int, { nullable: true });
        
        connection.execSql(request);
        resolve();
      }
      
    });
    connection.connect();
  });
}

//Exports the functions for use in other files
module.exports = {
  insertNews: insertNews,
  insertWeather: insertWeather
}
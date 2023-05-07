async function newsFile() {
// Import the connection object from dbConnection.js
const { insertNews } = require('./database/db_connect.js');

//Collect News and publish news
//Optimally these would be located in a non-public document
//News API key (newsapi.org)
let apiKeyOrg = '4d438c96e5c54b938fe57e7e8626fe0b'
//News API key (newsdata.io)
let apiKeyIo = 'pub_21427c59bc7f46af1620146c49ca0a37d767a'

//Defines the endpoints to retrieve the news from
let searchParameter = 'country=no'
let newsUrlOrg = `https://newsapi.org/v2/top-headlines?${searchParameter}&pagesize=15`
let newsUrlIo = `https://newsdata.io/api/1/news?apikey=${apiKeyIo}&country=dk`


//Truncates a string to a given length
const truncString = (str, max) => {
    return str === null || str === undefined ? null : (str.length > max ? str.substr(0, max - 3) + '...' : str);
}


let headersOrg = {
    'Authorization': `${apiKeyOrg}`
}

//Creates an empty array to store the news in
let articlesToInsert = []

//Fetches the news from the news api 1
const newsOrg = async () => {
    let response = await fetch(newsUrlOrg,
        {
            method: 'GET',
            headers: headersOrg
        }
    );
    return response.json();
}

newsOrg().then(data => {
    //Here the data should be inserted into the database
    let articles = data.articles;
    for (let i = 0; i < articles.length; i++) {
        //Makes sure that the fields are not too long for the database
        articlesToInsert.push({
            title: truncString(articles[i].title, 255),
            imageUrl: truncString(articles[i].urlToImage, 512),
            source: truncString(articles[i].source.name, 255),
            publishedAt: articles[i].publishedAt,
            author: truncString(articles[i].author, 255),
            url: truncString(articles[i].url, 512),
            description: truncString(articles[i].description, 255)
        })
    }

})

//Fetches the news from the news api 2
const newsIo = async () => {
    let response = await fetch(newsUrlIo,
        {
            method: 'GET'
        }
    );
    return response.json();
}

newsIo().then(async data => {
    //Here the data should be inserted into the database
    let articles = data.results;
    //Here the counter is set to 15, because the endpoint does not allow to set it in the request
    for (let i = 0; i < Math.min(15, articles.length); i++) {
        //Makes sure that the fields are not too long for the database
        articlesToInsert.push({
            title: truncString(articles[i].title, 255),
            imageUrl: truncString(articles[i].image_url, 512),
            source: truncString(articles[i].source_name, 255),
            publishedAt: articles[i].pubDate,
            author: null,
            url: truncString(articles[i].link, 512),
            description: truncString(articles[i].description, 255)
        })
    }

    //Inserts the news into the database
    await insertNews(articlesToInsert)
})

}

//Makes the function available to other files
module.exports = {
    newsFile: newsFile
};
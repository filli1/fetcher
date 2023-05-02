// Import the connection object from dbConnection.js
const { insertNews } = require('./database/db_connect.js');

//Collect News and publish news
//Optimally these would be located in a non-public document
//News API key (newsapi.org)
let apiKeyOrg = '4d438c96e5c54b938fe57e7e8626fe0b'
//News API key (newsdata.io)
let apiKeyIo = 'pub_21427c59bc7f46af1620146c49ca0a37d767a'


let searchParameter = 'country=no'
let newsUrlOrg = `https://newsapi.org/v2/top-headlines?${searchParameter}&pagesize=15`
let newsUrlIo = `https://newsdata.io/api/1/news?apikey=${apiKeyIo}&country=dk`

const truncString = (str, max) => {
    return str === null || str === undefined ? null : (str.length > max ? str.substr(0, max - 3) + '...' : str);
}


let headersOrg = {
    'Authorization': `${apiKeyOrg}`
}

let news = []
let test

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
    // console.log(data.articles[0].source)
    let articles2 = data.articles;
    console.log(articles2)
    for (let i = 0; i < articles.length; i++) {
        //Makes sure that the fields are not too long for the database
        news.push({
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
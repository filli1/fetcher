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



let headersOrg = {
    'Authorization': `${apiKeyOrg}`
}

let headersIo = {
    'Authorization': `${apiKeyIo}`
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
    let articles = data.articles;
    for (let i = 0; i < articles.length; i++) {
        //Makes sure that the fields are not too long for the database
        news.push({
            title: articles[i].title === null ? null : articles[i].title.substring(0, 255),
            imageUrl: articles[i].urlToImage === null ? null : articles[i].urlToImage.substring(0, 512),
            source: articles[i].source.name === null ? null : articles[i].source.name.substring(0, 255),
            publishedAt: articles[i].publishedAt,
            author: articles[i].author === null ? null : articles[i].author.substring(0, 255),
            url: articles[i].url === null ? null : articles[i].url.substring(0, 512),
            description: articles[i].description === null ? null : articles[i].description.substring(0, 255)
        })
    }
})



//Fetches the news from the news api 2
const newsIo = async () => {
    let response = await fetch(newsUrlIo,
        {
            method: 'GET',
            headers: headersIo
        }
    );
    return response.json();
}

newsIo().then(data => {
    //Here the data should be inserted into the database
    let articles = data.results;
    //Here the counter is set to 15, because the endpoint does not allow to set it in the request
    for (let i = 0; i < Math.min(15, articles.length); i++) {
        //Makes sure that the fields are not too long for the database
        news.push({
            title: articles[i].title === null ? null : articles[i].title.substring(0, 255),
            imageUrl: articles[i].image_url === null ? null : articles[i].image_url.substring(0, 512),
            source: articles[i].creator === null ? null : articles[i].creator.substring(0, 255),
            publishedAt: articles[i].published_date,
            author: null,
            url: articles[i].link === null ? null : articles[i].link.substring(0, 512),
            description: articles[i].content === null ? null : articles[i].content.substring(0, 255)
        })
    }

    //Inserts the news into the database
    insertNews(news)
})




var express = require('express'); 
var app = express();
const path = require('path'); 
var cors = require('cors'); 
const port = 4001

var server = app.listen(port, function(error){
    if (error) throw error;
    console.log("Express server listening on port, ", port)
});

//Collect News and publish news
let searchParameter = 'country=no'
let newsUrl = `https://newsapi.org/v2/top-headlines?${searchParameter}`

//Optimally would be located in a non-public document
let apiKey = '4d438c96e5c54b938fe57e7e8626fe0b'

let headers = {
    'Authorization': `${apiKey}`
}

//Fetches the news from the news api
const news = async () => {
    let response = await fetch(newsUrl,
        {
            method: 'GET',
            headers: headers
        }
    );
    return response.json();
}

news().then(data => {
    //Here the data should be inserted into the database
    console.log(data)
})
//Collect weather and publish weather
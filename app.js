var express = require('express'); 
var app = express();
const path = require('path'); 
var cors = require('cors'); 
const port = 4001
const {newsFile} = require('./news.js')
const {weatherFile} = require('./weather.js')
const { connection } = require('./database/db_connect.js');

var server = app.listen(port, function(error){
    if (error) throw error;
    console.log("Express server listening on port, ", port)
});

connection.connect();
newsFile()
weatherFile()

connection.close()

server.close()
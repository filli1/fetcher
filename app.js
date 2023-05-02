var express = require('express'); 
var app = express();
const path = require('path'); 
var cors = require('cors'); 
const port = 4001

var server = app.listen(port, function(error){
    if (error) throw error;
    console.log("Express server listening on port, ", port)
});

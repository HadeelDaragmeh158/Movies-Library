'use strict';
const memeData = require('./Movie Data/data.json');
const express = require('express');
const server = express();


server.get('/', handHome)
server.get('/favorite', handFave)
server.get('', handelServerError)
server.get('*', handnotfound)

function Meme(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


function handHome(req, res) {
    let meme = memeData.map(val => {
        return new Meme(val.title, val.poster_path, val.overview)
    });
    res.status(200).json(meme);
}

function handFave(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}

function handelServerError(req, res) {
    return res.status(500).send("Sorry, something went wrong");
    // function getStatusCode(site){
    //     var options = {
    //         host: "127.0.0.1",
    //         port: 8000,
    //         path: site,
    //         headers: {
    //                     Host: site
    //             }
    //         };
    
    //     var status;
    
    //     http.get(options, function(response) {
    //         status=response.statusCode;
    //     });
    //     return status;
    // }

}
function handnotfound(req, res) {
    return res.status(404).send("Page not found error");
}


server.listen(3000, () => {
    console.log("my server is listining to port 3000");
})
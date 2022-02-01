'use strict';

require('dotenv').config();
const memeData = require('./Movie Data/data.json');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const server = express();
server.use(cors());

const PORT = process.env.PORT;


server.get('/', handHome)
server.get('/favorite', handFave)
server.get('/trending', trendingHandler)
// server.get('', handelServerError)
server.get('/search', searchHandler)
server.use('*', handnotfound)
// server.use(errorHandler)
function Trending(id, title, release_date, poster_path, overview) {
    this.id = id,
        this.title = title,
        this.release_date = release_date,
        this.poster_path = poster_path,
        this.overview = overview;
}
function Meme(title, release_date, poster_path, overview) {
    this.title = title,
        this.release_date = release_date,
        this.overview = overview;
}
let numberOftrending = 5;
let title = "Spider-Man";

let urltrending = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;

function handHome(req, res) {
    let meme = memeData.map(val => {
        return new Meme(val.title, val.poster_path, val.overview)
    });
    res.status(200).json(meme);
}


function handFave(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}

function trendingHandler(req, res) {
    let newArr = [];
    axios.get(urltrending)
        .then((result) => {
            let arr = result.data.results.forEach(val => {
                newArr.push(new Trending(val.id, val.title, val.release_date, val.poster_path, val.overview, val.poster_path));
            })
            res.status(200).json(newArr);

        }).catch((err) => {
            console.log("Error");
        })
}



function searchHandler(req, res) {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${title}}&page=2`;


    axios.get(url)
        .then(result => {
            let search = result.data.results.map(val => {
                return new Trending(val.id, val.title, val.release_date, val.poster_path, val.overview, val.poster_path);
            });
            res.status(200).json(search);
        }).catch(err => {
            console.log("djfhl");

        })
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


server.listen(PORT, () => {
    console.log(`listining to port ${PORT}`)

})
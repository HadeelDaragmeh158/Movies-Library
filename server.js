'use strict';

require('dotenv').config();
const client = new pg.Client(process.env.DB_URL);
const memeData = require('./Movie Data/data.json');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;


server.get('/', handHome)
server.get('/favorite', handFave)
server.get('/trending', trendingHandler)
// server.get('', handelServerError)
server.post('/addMovie', handaddmov)//add movie
server.use('/getMovies', handgetmov)
server.get('/search', searchHandler)
server.use('*', handnotfound)
server.put('/updatemove', updateMove)
server.put('/delete', deletemove)
// server.use(errorHandler)


let numberOftrending = 5;
let title = "Spider-Man";
let urltrending = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;


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
    let url1 =` https://api.themoviedb.org/3/movie/158?api_key=1d065d11dea9fa7512bfa8769fe94a87&language=en-US`;
    let url2 = `https://api.themoviedb.org/3/movie/27?api_key=1d065d11dea9fa7512bfa8769fe94a87&language=en-US`;

    // axios.get(url)
    //     .then(result => {
    //         let search = result.data.results.map(val => {
    //             return new Trending(val.id, val.title, val.release_date, val.poster_path, val.overview, val.poster_path);
    //         });
    //         res.status(200).json(search);
    //     }).catch(err => {
    //         console.log("djfhl");

    //     })
}

function handaddmov(req, res) {
    const mov = req.body;
    let datasql = `INSERT INTO movies(title,id ,releas_data,poster_path,overview)VALUES($1,$2,$3,$4,$5)RETURNING *;`;
    let values = [mov.title || '', mov.release_date|| '', mov.poster_path|| '', mov.overview|| ''];
    client.query(datasql, values).then(data => {

        res.status(200).json(data.rows);
    }).catch(error => {
        handnotfound(req, res)
    });
}

function handgetmov(req, res) {
    let sql = `SELECT * FROM Movies;`;
    client.query(datasql).then(val => {
        response.status(200).json(data.rows)
    }).catch(error => {
        handelServerError(error, req, res);
    });
}
function updateMove(req,res)
{}

function handelServerError(Error, req, res) {
    return res.status(500).send("Sorry, something went wrong");
}


function handnotfound(req, res) {
    return res.status(404).send("Page not found error");
}


server.listen(PORT, () => {
    console.log(`listining to port ${PORT}`)

})
'use strict';

require('dotenv').config();
const memeData = require('./Movie Data/data.json');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const server = express();
const pg = require('pg');

server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
    })

server.get('/', handHome)
server.get('/favorite', handFave)
server.get('/trending', trendingHandler)
// server.get('', handelServerError)
server.post('/addMovie', handaddmov)//add movie
server.use('/getMovies', handgetmov)
server.get('/search', searchHandler)
server.get('/movie', movieone)
server.get('/movie2', movietow)
server.put('/updatemove/:id', updateMove)
server.delete('/delete/:id', deletemove)
server.get('/getMovie/:id', gitMov)
// server.use(errorHandler)
server.use('*', handnotfound)

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
        this.poster_path = poster_path,
        this.overview = overview;
}

function handHome(req, res) {
    let meme = memeData.map(val => {
        return new Meme(val.title, val.release_date, val.overview)
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
    let movname = req.query.movname;
    let url = ` https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${movname}`;

    axios.get(url)
        .then(result => {
            let search = result.data.results.map(val => {
                return new Trending(val.id, val.title, val.release_date, val.poster_path, val.overview, val.poster_path);
            });
            res.status(200).json(search);
        }).catch(err => {
            handelServerError(error, req, res);
            console.log("djfhl");

        })
}
function movieone(req, res) {
    let url1 = `https://api.themoviedb.org/3/list/156?api_key=${process.env.APIKEY}&language=en-US`;
    axios.get(url1)
        .then(result => {
            let add = result.data.results.map(val => {
                return new Trending(val.id, val.title, val.release_date, val.poster_path, val.overview, val.poster_path);
            });
            res.status(200).json(add);
        }).catch(err => {
            handelServerError(error, req, res);
            console.log("djfhl");

        })
}
function movietow(req, res) {
    let url2 = `https://api.themoviedb.org/3/movie/27?api_key=${process.env.APIKEY}&language=en-US`;
    axios.get(ur2)
        .then(result => {
            let add = result.data.results.map(val => {
                return new Trending(val.id, val.title, val.release_date, val.poster_path, val.overview, val.poster_path);
            });
            res.status(200).json(add);
        }).catch(err => {
            handelServerError(error, req, res);
            console.log("djfhl");

        })
}


function handaddmov(req, res) {
    const mov = req.body;
    // console.log(req.body);
    let datasql = `INSERT INTO reqdb( title,release_date,poster_path,overview)VALUES($1,$2,$3,$4)RETURNING *;`;
    let values = [mov.title || '', mov.release_date || '', mov.poster_path || '', mov.overview || ''];
    client.query(datasql, values).then(data => {
        console.log(data.rows);
        res.status(200).json(data.rows);
    }).catch(error => {
        handelServerError(error, req, res);
        console.log(error, "ERROR")
    });
}

function handgetmov(req, res) {
    let sql = `SELECT * FROM reqdb;`;
    client.query(sql).then(val => {
        res.status(200).json(val.rows)
    }).catch(error => {
        console.log(error);
        handelServerError(error, req, res);
    });
}
function updateMove(req, res) {
    console.log("the func update");
    const id = req.params.id;
    console.log(id);
    const mov = req.body;
    const sql = `UPDATE reqdb SET title =$1, release_date = $2, poster_path = $3 ,overview=$4 WHERE id=$5 RETURNING *;`;
    let values = [mov.title, mov.release_date, mov.poster_path, mov.overview, id];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
        // res.status(204)
    }).catch(error => {
        handelServerError(error)
    });
}


function deletemove(req,res) {
    const id = req.params.id;
    const sql = `DELETE FROM reqdb WHERE id=${id};`;

    client.query(sql).then(() => {
        res.status(200).send("The Recipe has been deleted");
        // res.status(204).json({});
    }).catch(error => {
        handelServerError(error, req, res)
    });
}

function gitMov(req,res){
    const id = req.params.id;
    let sql=`SELECT * FROM reqdb WHERE id=${id};`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
        // res.status(204)
    }).catch(error => {
        handelServerError(error)
    });

}

function handelServerError(Error, req, res) {
    return res.status(500).send("Sorry, something went wrong");
}


function handnotfound(req, res) {
    return res.status(404).send("Page not found error");
}

client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)

    })
})
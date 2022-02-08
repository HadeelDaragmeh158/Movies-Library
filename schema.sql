DROP TABLE IF EXISTS reqdb;
CREATE TABLE IF NOT EXISTS reqdb(
    id SERIAL PRIMARY KEY ,
    title VARCHAR (255),
    release_date VARCHAR (255),
    poster_path VARCHAR (255),
    overview   VARCHAR  (4000)
);
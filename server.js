'use strict';

const express = require('express'); // npm install express

//const axios = require("axios");
const logger = require('./middlewares/logger');
//const validate = require("./middlewares/validate");
const errorHandler = require('./handlers/500');
const fourofour = require('./handlers/404');
//const routeHandlers = require("./handlers/routeHandlers");
//const { getImages } = require("./handlers/routeHandlers");
//const getRandom = require("./handlers/getRandom");
//const wildCards = require("./handlers/wildCards");
//const getProducts = require("./handlers/products");
//const Ajv = require("ajv");

require('dotenv').config(); // npm i dotenv
//const mongoose = require("mongoose");
const DEFAULT_PORT = 3001;
const PORT = process.env.PORT || DEFAULT_PORT;

//  function to act as handler returning contents of saved images collection

function getUniversities(req, res) {
  let SQL = 'SELECT * FROM universities';
  client
    .query(SQL)
    .then((results) => {
      res.status(200).send(results.rows);
    })
    .catch((error) => {
      // res.status(200).send("there was an error ");
      console.log(error);
    });
}

// handler for creating university with data from client

function postHandler(req, res) {
  // get data from client, if object does not match object structure send error
  console.log('in post handler body value is ', req.body);
  //res.status(500).send("empty body");
  // console.log(req);
  const obj = req.body;
  console.log(obj.uniname, obj.uniwebpage);
  let uniname = obj.uniname;
  let uniwebpage = String(obj.uniwebpage);

  let SQL = 'INSERT INTO universities ( uniname,uniwebpage ) VALUES ($1,$2)';
  console.log('just before safevalues');
  let safeValues = [[uniname], [uniwebpage]]; //["newcastle", "www.ncl.ac.uk"]; //[uniname, uniwebpage];
  console.log('after safe values');
  client
    .query(SQL, safeValues)
    .then((results) => {
      //res.status(200).send(results.rows);
      getUniversities(req, res);
    })
    .catch((error) => {
      console.log(error);
    });
}

// handler for deleting a database entry by id from client

function deleteHandler(req, res) {
  // get data from client, if object does not match object structure send error
  console.log('in delete handler body value is ', req.body);

  const obj = req.body;
  console.log(obj.uniname);
  let uniname = obj.uniname;

  let SQL = 'DELETE FROM universities WHERE uniname=$1';
  console.log('just before safevalue');
  let safeValue = [[uniname]];
  console.log('after safe value');
  client
    .query(SQL, safeValue)
    .then((results) => {
      //res.status(200).send(results.rows);
      getUniversities(req, res);
    })
    .catch((error) => {
      console.log(error);
    });
}

//seedCollection();   // comment out after initial write

//schema: drawing phase
// model: creation phase

//const testModel = mongoose.model("testParts", testSchema);

const app = express();
const cors = require('cors');
const { pg, Client } = require('pg');

app.use(cors());
//const client = new pg.Client(process.env.DATABASE_URL);
const client = new Client({
  user: 'postgres',
  // host: "http://127.0.0.1/",
  database: 'universities',
  password: 'admin',
  port: 5432,
});
app.use(express.json());
app.use(logger);

//app.get("/myimagesapi", getProducts); // removed validate middleware temporarily
app.get('/', (req, res) => {
  res.status(200).send('its brilliant');
});
app.get('/universities', getUniversities);
app.post('/universities', postHandler);
//app.put("/myimages/:id", idHandler);
app.delete('/universities', deleteHandler);

//app.get("/randomimage", getRandom);
app.get('*', fourofour, (req, res) => {
  res.status(200).send('no page here');
});

app.use(errorHandler); // final catchall error routine

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
});
module.exports = {
  app: app,
};

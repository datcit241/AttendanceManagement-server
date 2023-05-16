require("dotenv").config();
const express = require("express");
const auth = require("./controllers/authControllers");

const app = express();

app.use(express.json());

app.use(auth);

module.exports = app;
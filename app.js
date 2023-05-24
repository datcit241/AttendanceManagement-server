require("dotenv").config();
const express = require("express");
const authController = require("./controllers/authControllers");
const coursesController = require("./controllers/coursesController")

const app = express();

app.use(express.json());

require("./seeders");

app.use(authController);
app.use("/courses", coursesController);

module.exports = app;
require("dotenv").config();
const express = require("express");
const authController = require("./controllers/authControllers");
const coursesController = require("./controllers/coursesController")

const app = express();

app.use(express.json());

app.use(authController);
app.use("/courses", coursesController);

module.exports = app;
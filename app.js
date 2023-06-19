require("dotenv").config();
const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
const authController = require("./controllers/authControllers");
const coursesController = require("./controllers/coursesController")
const fileUploadController = require("./controllers/fileUploadController")

const app = express();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

require("./seeders");

app.use(authController);
app.use("/courses", coursesController);
app.use("/fileUpload", fileUploadController);

module.exports = app;
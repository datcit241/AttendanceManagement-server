const {Router} = require("express");
const app = Router();

const dataContext = require("../models");
const Course = dataContext["Course"];

app.get("/list", async (request, response) => {
    const courses = await Course.findAll();
    response.send({courses});
});

module.exports = app;
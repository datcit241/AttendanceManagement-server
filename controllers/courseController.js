const {Router} = require("express");
const app = Router();

const Course = require("../model/course");

app.get("/list", async (request, response) => {
    const courses = await Course.findAll();
    response.send({courses});
});

module.exports = app;
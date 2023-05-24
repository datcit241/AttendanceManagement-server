const models = require("../models");
const Course = models["Course"];

module.exports = async () => {
    const courses = [
        {
            code: "CSE 470",
            name: "Cloud computing"
        },
        {
            code: "CSE 306",
            name: "Network communication"
        }
    ];

    courses.forEach(course => {
        Course.findOrCreate({where: course, defaults: course});
    });
}
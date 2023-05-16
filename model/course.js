const sequelize = require("../config/sequelize");
const {Sequelize} = require("sequelize");

const Course = sequelize.define('course', {
    coe: {
        type: Sequelize.STRING,
    },
    name: {
        type: Sequelize.STRING,
    },
}, {
    freezeTableName: true
})

Course.sync({force: true})

module.exports = Course;
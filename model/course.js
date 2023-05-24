const sequelize = require("../config/sequelize");
const {Sequelize} = require("sequelize");

const Course = sequelize.define('course', {
    code: {
        type: Sequelize.STRING,
        unique: true,
    },
    name: {
        type: Sequelize.STRING,
    },
}, {
    freezeTableName: true
})

Course.sync({alter: true});

module.exports = Course;
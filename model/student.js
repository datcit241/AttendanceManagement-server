const sequelize = require("../config/sequelize");
const {Sequelize} = require("sequelize");

const Student = sequelize.define('student', {
    code: {
        type: Sequelize.STRING,
        unique: true,
    },
    name: {
        type: Sequelize.STRING,
    },
    photo: {
        type: Sequelize.STRING,
    }
}, {
    freezeTableName: true
})

Student.sync({alter: true})

module.exports = Student;
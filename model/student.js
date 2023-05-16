const sequelize = require("../config/sequelize");
const {Sequelize} = require("sequelize");

const Student = sequelize.define('student', {
    coe: {
        type: Sequelize.STRING,
    },
    name: {
        type: Sequelize.STRING,
    },
}, {
    freezeTableName: true
})

Student.sync({force: true})

module.exports = Student;
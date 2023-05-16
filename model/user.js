const sequelize = require("../config/sequelize");
const {Sequelize} = require("sequelize");

const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    token: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true
})

User.sync({force: true})

module.exports = User;
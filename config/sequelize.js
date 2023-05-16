const Sequelize = require('sequelize');

const sequelize = new Sequelize('attendance_management', 'root', 'root', {
    host: 'localhost',
    dialect: 'mariadb',

    pool: {
        max: 5,
        min : 0,
        idle: 10000
    }
});

try {
    sequelize.authenticate();
    console.log("Connection has been established successfully");
} catch (err) {
    console.error("Unable to connect to the database: ", err);
}

module.exports = sequelize;
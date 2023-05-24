const Sequelize = require('sequelize');
const AWS = require("aws-sdk");
const {Signer} = AWS.RDS;
const fs = require("fs");

const signer = new Signer({
    region: process.env.REGION,
    username: process.env.DB_USER,
    hostname: process.env.DB_HOST,
    port: +process.env.DB_PORT
});

const getToken = () => {
    return signer.getAuthToken();
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    getToken(),
    {
        host: process.env.DB_HOST,
        dialect: "mariadb",
        dialectOptions: {
            ssl: {ca: fs.readFileSync("ap-southeast-1-bundle.pem")},
            authPlugins: {
                mysql_clear_password: () => () => {
                    return getToken();
                }
            }
        },
        port: +process.env.DB_PORT,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logQueryParameters: true
    });

try {
    sequelize.authenticate();
    console.log("Connection has been established successfully");
} catch (err) {
    console.error("Unable to connect to the database: ", err);
}

module.exports = sequelize;
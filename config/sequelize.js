const Sequelize = require('sequelize');
const AWS = require("aws-sdk");
const {Signer} = AWS.RDS;

const signer = new Signer({
    // credentials: new AWS.SharedIniFileCredentials({profile: 'default'}),
    region: process.env.REGION,
    username: process.env.DB_USER,
    hostname: process.env.DB_HOST,
    port: 3306
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
            ssl: "ap-southeast-1-bundle.pem",
            authPlugins: { // authSwitchHandler is deprecated
                mysql_clear_password: () => () => {
                    return getToken();
                }
            }
        },
        port: 3306,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        // define: {
        //     charset: 'utf8mb4'
        // }
    });

sequelize.beforeConnect(async (config) => {
    // config.password = process.env.DB_PASSWORD;
    config.password = getToken();
    console.log(getToken());
});

try {
    sequelize.authenticate();
    console.log("Connection has been established successfully");
} catch (err) {
    console.error("Unable to connect to the database: ", err);
}

module.exports = sequelize;
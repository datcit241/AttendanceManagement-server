"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const AWS = require("aws-sdk");

const {Signer} = AWS.RDS;

const signer = new Signer(
    {
        ...config,
        hostname: config.host,
    }
);

const getToken = async () => {
    if (env === "development") {
        return Promise.resolve(config.password);
    }
    return await signer.getAuthToken();
}

if (env === "production") {
    config.dialectOptions = {
        ssl: {ca: fs.readFileSync("us-east-1-bundle.pem")},
        authPlugins: {
            mysql_clear_password: () => async () => {
                return await getToken();
            }
        }
    }
}

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.beforeConnect(async (config) => {
    config.password = await getToken();
});

try {
    sequelize.authenticate();
    console.log("Connection has been established successfully");
} catch (err) {
    console.error("Unable to connect to the database: ", err);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        // model.sync()
        //     .then(r => console.log(`Sync ${model.name}`))
        //     .catch(e => console.log(`Sync failed - model ${model.name}`, e))
        // ;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

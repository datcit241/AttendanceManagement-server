const {Router} = require("express");
const process = require("process");
const app = Router();
const env = process.env.NODE_ENV || "development";
const fs = require("fs");
const config = require(__dirname + "/../config/config.json")[env];
const path = require('path');
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const Model = require("../models");

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const s3Client = new S3Client(AWS.Credentials);

app.get("/", async (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

app.get("/list", async (req, res) => {
    let list;
    try {
        list = await Model.File.findAll();
    } catch (err) {
        return res.status(400).send();
    }

    return res.status(200).send(list);
});

app.get("/get", async (req, res) => {
    const {id} = req.query;

    function encode(data) {
        let buf = Buffer.from(data);
        return buf.toString("base64");
    }

    async function getImage() {
        return s3
            .getObject({
                Bucket: "attendance.management.bucket",
                Key: id,
            })
            .promise();
    }

    getImage()
        .then(img => {
            res.send('data:image/jpeg;base64,' + encode(img.Body));
        }).catch(err => res.send(err));

})
app.post("/", upload.single("file"), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send();

    const dotIndex = file.originalname.lastIndexOf(".");
    const ext = dotIndex > -1 ? file.originalname.substring(dotIndex) : null;
    const fileName = dotIndex > -1 ? file.originalname.substring(0, dotIndex) : file.originalname;
    const fileObj = await Model.File.create({name: fileName, extension: ext});

    const bucketParams = {
        Bucket: "attendance.management.bucket",
        Key: fileObj.id,
        Body: file.buffer,
    };
    try {
        await s3.putObject(bucketParams).promise()
        // const data = await s3Client.send(new PutObjectCommand(bucketParams));
        // res.send(response)
    } catch (err) {
        console.log("Error", err);
    }

    res.send(fileObj);
});

module.exports = app;

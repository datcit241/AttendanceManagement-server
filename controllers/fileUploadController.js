const {Router} = require("express");
const process = require("process");
const app = Router();
const env = process.env.NODE_ENV || "development";
const fs = require("fs");
const config = require(__dirname + "/../config/config.json")[env];
const path = require('path');
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');

const AWS = require('aws-sdk');

const s3Client = new S3Client(AWS.Credentials);

app.get("/", async (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});
app.post("/", upload.single("file"), async (req, res) => {
    const file = req.file;
    const fileName = file.originalname;

    const bucketParams = {
        Bucket: "attendance.management",
        Key: fileName,
        Body: file.buffer,
    };
    try {
        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        res.send(data)
    } catch (err) {
        console.log("Error", err);
    }
});

module.exports = app;

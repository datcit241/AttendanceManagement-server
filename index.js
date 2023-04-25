const https = require("https");
const fs = require("fs");
const app = require("./app");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// http
// const server = https.createServer(app);

// https
const options = {
  key: fs.readFileSync(__dirname + '/dist/fixtures/keys/key.pem'),
  cert: fs.readFileSync(__dirname + '/dist/fixtures/keys/cert.pem')
};

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

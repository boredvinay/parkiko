const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path");
const send = require("send");

const app = express();

const sslOptions = {
  key: process.env.SSL_KEY_FILE ? fs.readFileSync(process.env.SSL_KEY_FILE) : undefined,
  cert: process.env.SSL_CRT_FILE ? fs.readFileSync(process.env.SSL_CRT_FILE) : undefined,
};

app.use("/static", express.static(path.join(__dirname, "static")));

// Adding tabs to our app. This will setup routes to various views

// serve React bundles
app.use(express.static(path.join(__dirname, '../appPackage/build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../appPackage/build/index.html'));
});

const port = process.env.port || process.env.PORT || 3978;
app.listen(port, () => console.log(`Server listening on ${port}`));
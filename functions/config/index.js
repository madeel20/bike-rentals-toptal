const functions = require("firebase-functions");

const config = functions.config();

module.exports = { envConfig: config };

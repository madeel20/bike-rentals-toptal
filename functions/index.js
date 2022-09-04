const functions = require("firebase-functions");
const { envConfig } = require("./config/index");
const express = require("express");
const app = express();
const admin = require("firebase-admin");
const cors = require("cors");
const firebaseAuth = require("./middleware/firebaseAuth");
require("dotenv").config();
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

admin.initializeApp({
  credential: admin.credential.cert({
    ...envConfig.service_account,
    ...envConfig.service_account,
    private_key: envConfig.service_account.private_key.replace(/\\n/g, "\n"), // NOW THIS WORKS!!!
  }),
  databaseURL: `${envConfig.database.url}`,
});

/**
 * Get All Users | GET | /user
 */
app.get("/user", firebaseAuth, async (req, response) => {
  admin
    .auth()
    .listUsers()
    .then(function (res) {
      let users = res.users.map(
        ({ uid, email, customClaims, displayName }) => ({
          uid,
          email,
          isManager: customClaims && customClaims.isManager,
          displayName,
          ads:'asdfa'
        })
      );
      response.status(200).json({ users });
    })
    .catch(function (err) {
      response
        .status(500)
        .json({ message: err.message || "Something went wrong!" });
    });
});


/**
 * Create A User | POST | /user
 */
app.post("/user", firebaseAuth, async (req, response) => {
  let { displayName, email, password } = req.body;
  admin
    .auth()
    .createUser({
      email,
      displayName,
      password,
    })
    .then((res) => {
      admin
        .auth()
        .setCustomUserClaims(res.uid, {
          isManager: true,
        })
        .then(() => response.status(200).json({ message: "User Created!" }));
    })
    .catch((err) =>
      response
        .status(500)
        .json({ message: err.message || "Something went wrong!" })
    );
});


/**
 * Update A User | PATCH | /user
 */
app.patch("/user", firebaseAuth, async (req, response) => {
  let { uid, isManager, displayName } = req.body;

  admin
    .auth()
    .getUser(uid)
    .then(async (res) => {
      await Promise.all([
        admin.auth().setCustomUserClaims(res.uid, {
          isManager,
        }),
        admin.auth().updateUser(res.uid, {
          displayName,
        }),
      ]);
    })
    .then(() => response.status(200).json({ message: "User Updated!" }))
    .catch((err) =>
      response
        .status(500)
        .json({ message: err.message || "Something went wrong!" })
    );
});

/**
 * Delete A User | DELETE | /user
 */
app.delete("/user", firebaseAuth, async (req, response) => {
  let { uid } = req.body;

  admin
    .auth()
    .deleteUser(uid)
    .then(() => response.status(200).json({ message: "User Deleted!" }))
    .catch((err) =>
      response
        .status(500)
        .json({ message: err.message || "Something went wrong!" })
    );
});

exports.api = functions.https.onRequest(app);

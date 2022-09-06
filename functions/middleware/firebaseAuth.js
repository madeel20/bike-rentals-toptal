const admin = require("firebase-admin");

/**
 * @description - Verifies firebase authorization token on each request
 */
async function firebaseAuth(req, res, next) {
  try {
    let token = await admin.auth().verifyIdToken(req.headers["authorization"]);

    // Lookup the user associated with the specified uid.
    let userRecord = await admin
      .auth()
      .getUser(token.uid);

    // Only allow manager role to access APIs
    if (!userRecord.customClaims.isManager)
      res.status(401).json({ error: { code: "unauthenticated" } });

    req.token = token;

    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: { code: "unauthenticated" } });
  }
}

module.exports = firebaseAuth;

const admin = require('firebase-admin');

/**
 * @description - Verifies firebase authorization token on each request
 */
async function firebaseAuth(req, res, next) {
  try {
    req.token = await admin.auth().verifyIdToken(req.headers['authorization']);
    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: { code: 'unauthenticated' } });
  }
}

module.exports = firebaseAuth;
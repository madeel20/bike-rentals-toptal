const admin = require('firebase-admin');

async function firebaseAuth(req, res, next) {
  try {
    console.log(req.headers['authorization'])
    req.token = await admin.auth().verifyIdToken(req.headers['authorization']);
    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: { code: 'unauthenticated' } });
  }
}

module.exports = firebaseAuth;
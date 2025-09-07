// utils/jwt.js
const jwt = require('jsonwebtoken');

function signJwt(payload, opts = {}) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '7d', ...opts }
  );
}
function verifyJwt(token) {
  try { return jwt.verify(token, process.env.JWT_SECRET); }
  catch { return null; }
}

module.exports = { signJwt, verifyJwt };






// const jwt = require("jsonwebtoken");
// function verifyToken(token) {
//   try { return jwt.verify(token, process.env.JWT_SECRET); }
//   catch { return null; }
// }
// module.exports = { verifyToken };

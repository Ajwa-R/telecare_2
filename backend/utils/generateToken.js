const { signJwt } = require('./jwt');
module.exports = (id) => signJwt({ id });

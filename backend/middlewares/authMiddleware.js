const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_HARDCODED_ID = 'admin-hardcoded-id';

const protect = async (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const uid = decoded?.id || decoded?._id || decoded?.userId;

    // ✅ admin token ko DB lookup ke bina allow karo
    if (uid === ADMIN_HARDCODED_ID) {
      req.user = { _id: ADMIN_HARDCODED_ID, role: 'admin', name: 'Admin', email: 'admin@gmail.com' };
      return next();
    }

    // baqi sab ke liye DB se user lao
    let user;
    try {
      user = await User.findById(uid).select('-password');
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verify failed:', err.name, err.message);
    const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ message: msg });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = { protect, requireRole };



// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Not authorized' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };
// // add this export:
// const requireRole = (role) => (req, res, next) => {
//   if (!req.user || req.user.role !== role) {
//     return res.status(403).json({ message: 'Forbidden' });
//   }
//   next();
// };
// module.exports = { protect, requireRole };

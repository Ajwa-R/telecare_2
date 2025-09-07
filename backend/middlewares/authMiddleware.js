// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional: hardcoded admin bypass (same as your current logic)
const ADMIN_HARDCODED_ID = 'admin-hardcoded-id';

const protect = async (req, res, next) => {
  // Read JWT from HttpOnly cookie (set by login)
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // common id fields: sub | id | _id | userId
    const uid = decoded?.sub || decoded?.id || decoded?._id || decoded?.userId;
    if (!uid) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    // Allow hardcoded admin without DB lookup (if you still want this)
    if (uid === ADMIN_HARDCODED_ID) {
      req.user = { _id: ADMIN_HARDCODED_ID, role: 'admin', name: 'Admin', email: 'admin@gmail.com' };
      return next();
    }

    // Load user (no password), keep response small & consistent
    const user = await User.findById(uid).select('name email role gender age specialization experience isApproved');
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    // Attach a normalized shape
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      age: user.age,
      specialization: user.specialization,
      experience: user.experience,
      isApproved: user.isApproved,
    };

    return next();
  } catch (err) {
    // TokenExpiredError or any other JWT errors
    return res.status(401).json({ message: 'Unauthenticated' });
  }
};

// Single role OR any-of roles guard
const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? new Set(roles) : new Set([roles]);
  return (req, res, next) => {
    if (!req.user || !allowed.has(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { protect, requireRole };











// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const ADMIN_HARDCODED_ID = 'admin-hardcoded-id';

// const protect = async (req, res, next) => {
//   const auth = req.headers.authorization || '';
//   const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

//   if (!token) return res.status(401).json({ message: 'Not authorized' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const uid = decoded?.id || decoded?._id || decoded?.userId;

//     // admin token ko DB lookup ke bina allow karo
//     if (uid === ADMIN_HARDCODED_ID) {
//       req.user = { _id: ADMIN_HARDCODED_ID, role: 'admin', name: 'Admin', email: 'admin@gmail.com' };
//       return next();
//     }

//     // baqi sab ke liye DB se user lao
//     let user;
//     try {
//       user = await User.findById(uid).select('-password');
//     } catch {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     if (!user) return res.status(401).json({ message: 'User not found' });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('JWT verify failed:', err.name, err.message);
//     const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
//     return res.status(401).json({ message: msg });
//   }
// };

// const requireRole = (role) => (req, res, next) => {
//   if (!req.user || req.user.role !== role) {
//     return res.status(403).json({ message: 'Forbidden' });
//   }
//   next();
// };

// module.exports = { protect, requireRole };




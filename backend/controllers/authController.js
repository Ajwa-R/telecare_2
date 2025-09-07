// controllers/authController.js
// Login/Register/Google auth with HttpOnly cookie (no token in JSON body)

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- helpers ---
function signJwt(user) {
  // keep payload small; use `sub` as primary identifier
  return jwt.sign(
    { sub: user._id?.toString?.() || user, role: user.role || 'patient' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

function userDto(u) {
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    gender: u.gender,
    age: u.age,
    specialization: u.specialization,
    experience: u.experience,
    image: u.image || '',
    isVerified: u.isVerified,
  };
}

// -------------------- REGISTER (JSON only) --------------------
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, age, specialization, role, experience } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // FE no longer uploads image; keep empty string as placeholder
    const newUser = await User.create({
      name,
      email,
      password,
      gender,
      age,
      specialization,
      role,
      experience,
      image: '', // no file/multer
    });

    // DO NOT send token in body
    return res.status(200).json({ user: userDto(newUser) });
  } catch (err) {
    console.error('registerUser error:', err);
    return res.status(500).json({ message: err.message || 'Registration failed' });
  }
};

// -------------------- LOGIN (sets HttpOnly cookie) --------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin path (kept as you had)
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      const adminUser = {
        _id: 'admin-hardcoded-id',
        name: 'Admin',
        email,
        role: 'admin',
      };
      const token = signJwt(adminUser._id); // role not needed for payload here
      setAuthCookie(res, token);
      return res.status(200).json(userDto(adminUser));
    }

    // Normal login
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Doctor must be approved/verified before login (you used isVerified)
    if (user.role === 'doctor' && !user.isVerified) {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }

    const token = signJwt(user);
    setAuthCookie(res, token);

    // Return only user (no token field)
    return res.status(200).json(userDto(user));
  } catch (err) {
    console.error('loginUser error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// -------------------- GOOGLE LOGIN (sets HttpOnly cookie) --------------------
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Missing Google credential' });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload || {};
    if (!email) return res.status(400).json({ message: 'Google email not found' });

    let user = await User.findOne({ email });
    if (!user) {
      // default role patient; password will be hashed by pre-save if model supports
      user = await User.create({
        name,
        email,
        password: 'default', // safe if your schema hashes on save; otherwise consider a random string
        role: 'patient',
        image: '', // optional: payload.picture
      });
    }

    const token = signJwt(user);
    setAuthCookie(res, token);

    return res.json(userDto(user));
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
};

// -------------------- LOGOUT (clears cookie) --------------------
exports.logout = async (_req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: 'Logout failed' });
  }
};













// // controllers/authController.js
// // Yahan hum login/register ka logic likh rahe hain

// const User = require('../models/User'); 
// const generateToken = require('../utils/generateToken');
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// //register controller
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, gender, age, specialization, role, experience } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//    return res.status(400).json({ message: 'User already exists' });
//  }

//    //image form local multer
//   //  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
// const imageUrl = req.file?.filename
//     ? `/uploads/${req.file.filename}`
//      : (req.file?.path?.includes('/uploads/')
//         ? req.file.path.replace(/^.*(\/uploads\/)/, '/uploads/')
//         : "");

//     const newUser = await User.create({
//       name,
//       email,
//       password,
//       gender,
//       age,
//       specialization,
//       role,
//       experience,
//       image: imageUrl,
//     });

//     console.log('✅ User created:', newUser); 

//     res.status(200).json({
//       token: generateToken(newUser._id),
//       user: {
//         _id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//         gender: newUser.gender,
//         age: newUser.age,
//         specialization: newUser.specialization,
//         experience: newUser.experience,
//         image: newUser.image,
        
//       }
//     });

//   } catch (err) {
//     console.error('error in register user', err);
//     return res.status(500).json({ message: err.message || 'Registeration failed' });
//   }
// };


//  // Login Controller
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//     // admin login
//   if (email === "admin@gmail.com" && password === "admin@123") {
//     return res.status(200).json({
//       _id: "admin-hardcoded-id",
//       name: "Admin",
//       email,
//       role: "admin",
//       token: generateToken("admin-hardcoded-id"),
//     });
//   }
// // normal wala login
//   const user = await User.findOne({ email }).select('+password');;
//    if (!user) {
//    return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   const isMatch = await user.matchPassword(password);
//    if (!isMatch) {
//    return res.status(401).json({ message: 'Invalid credentials' });
//  }
  
//   // doctors ko approve kerne login ke liye
//   if (user.role === 'doctor' && !user.isVerified) {
//   return res.status(403).json({ message: 'Your account is pending admin approval.' });
// }

//   res.status(200).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     isVerified: user.isVerified,
//     token: generateToken(user._id),
//   });
  
// };


// //google
// exports.googleAuth = async (req, res) => {
//   try {
//     const { credential } = req.body;

//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name } = payload;

//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         password: 'default', 
//         role: 'patient'
//       });
//     }

//     const token = generateToken(user._id);
//    res.json({
//   token,
//   user: {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     gender: user.gender,
//     age: user.age,
//     specialization: user.specialization
//   }
// });

//   } catch (err) {
//     console.error('Google auth error:', err.message);
//     res.status(500).json({ message: 'Google login failed' });
//   }
// };
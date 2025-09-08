const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- helpers ---
function signJwt(user) {
  // keep payload small; use 
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

    const newUser = await User.create({
      name,
      email,
      password,
      gender,
      age,
      specialization,
      role,
      experience,
      // image: '', // no file/multer
    });

    //  NOT send token in body
    return res.status(200).json({ user: userDto(newUser) });
  } catch (err) {
    console.error('registerUser error:', err);
    return res.status(500).json({ message: err.message || 'Registration failed' });
  }
};

// -- LOGIN (sets HttpOnly cookie) 
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin path 
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      const adminUser = {
        _id: 'admin-hardcoded-id',
        name: 'Admin',
        email,
        role: 'admin',
      };
      const token = signJwt(adminUser._id); 
      setAuthCookie(res, token);
      return res.status(200).json(userDto(adminUser));
    }

    // Normal login
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Doctor must be approved/verified before login 
    if (user.role === 'doctor' && !user.isVerified) {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }

    const token = signJwt(user);
    setAuthCookie(res, token);

    // Return only user
    return res.status(200).json(userDto(user));
  } catch (err) {
    console.error('loginUser error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// -------------------- GOOGLE LOGIN 
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
        password: 'default',
        role: 'patient',
        // image: '', // optional: payload.picture
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

// -------------------- GET /auth/me (current user) --------------------
exports.getMe = async (req, res) => {
  // protect middleware ne req.user attach kiya hot h
  // aur protect me isApproved select kar re. Consistency ke liye dono expose .
  const u = req.user || {};
  return res.json({
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    gender: u.gender,
    age: u.age,
    specialization: u.specialization,
    experience: u.experience,
    image: u.image || "",
    // normalize flags so FE kabhi confuse na ho
    isVerified: u.isVerified ?? u.isApproved ?? false,
    isApproved: u.isApproved ?? u.isVerified ?? false,
  });
};













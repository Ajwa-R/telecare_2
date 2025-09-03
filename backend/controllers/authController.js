// controllers/authController.js
// Yahan hum login/register ka logic likh rahe hain

const User = require('../models/User'); 
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


//register controller
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, age, specialization, role, experience } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
   return res.status(400).json({ message: 'User already exists' });
 }

   //image form local multer
  //  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
const imageUrl = req.file?.filename
    ? `/uploads/${req.file.filename}`
     : (req.file?.path?.includes('/uploads/')
        ? req.file.path.replace(/^.*(\/uploads\/)/, '/uploads/')
        : "");

    const newUser = await User.create({
      name,
      email,
      password,
      gender,
      age,
      specialization,
      role,
      experience,
      image: imageUrl,
    });

    console.log('✅ User created:', newUser); 

    res.status(200).json({
      token: generateToken(newUser._id),
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        gender: newUser.gender,
        age: newUser.age,
        specialization: newUser.specialization,
        experience: newUser.experience,
        image: newUser.image,
        
      }
    });

  } catch (err) {
    console.error('error in register user', err);
    return res.status(500).json({ message: err.message || 'Registeration failed' });
  }
};


 // Login Controller
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

    // admin login
  if (email === "admin@gmail.com" && password === "admin@123") {
    return res.status(200).json({
      _id: "admin-hardcoded-id",
      name: "Admin",
      email,
      role: "admin",
      token: generateToken("admin-hardcoded-id"),
    });
  }
// normal wala login
  const user = await User.findOne({ email }).select('+password');;
   if (!user) {
   return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);
   if (!isMatch) {
   return res.status(401).json({ message: 'Invalid credentials' });
 }
  
  // doctors ko approve kerne login ke liye
  if (user.role === 'doctor' && !user.isVerified) {
  return res.status(403).json({ message: 'Your account is pending admin approval.' });
}

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    token: generateToken(user._id),
  });
  
};


//google
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'default', 
        role: 'patient'
      });
    }

    const token = generateToken(user._id);
   res.json({
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    gender: user.gender,
    age: user.age,
    specialization: user.specialization
  }
});

  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(500).json({ message: 'Google login failed' });
  }
};
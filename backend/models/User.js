 const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');

 const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['patient','doctor'],
        default: 'patient',
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },

  age: {
    type: Number,
    min: 0,
  },

  specialization: {
    type: String,
  },

  experience: Number,            
  image: { type: String, default: "" },
  isVerified: { type: Boolean, default: false },//pahle doctor ko apprve kare ga admin
 },{timestamps:true});

 // password ko hash kerna ka middleware
  userSchema.pre('save', async function (next){
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

  //password match method
   userSchema.methods.matchPassword = async function (enteredPassword) {
    return  bcrypt.compare(enteredPassword, this.password);
   };

   module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  }, 
  votes: {
    questions: Map,  // Key: questionId, Value: 'up' or 'down'
    answers: Map,    // Key: answerId, Value: 'up' or 'down'
    comments: Map    // Key: commentId, Value: 'up' or 'down'
  }
  // add length of time, reputation, questions asked, answers posted, 
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash with salt
    next();
  } catch (error) {
    next(error); // Pass errors to the next middleware
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password); // Compare input password with hashed password
};

module.exports = mongoose.model('User', userSchema); // Export the User model

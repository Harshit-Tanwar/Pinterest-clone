const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pinterest');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,

  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,   
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' // References the Post model
  }],
  fullname: {
    type: String,
    trim: true
  }
});
userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);


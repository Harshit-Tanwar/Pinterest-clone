const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pinterest');

const postSchema = new mongoose.Schema({
    postText: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
    },
   createdAt: {
        type: Date,
        default: Date.now // Sets the default value to the current date and time
    },
    likes: {
        type: Array,
        default: []
    },
    // user: {  // Add this field to link the post to the user who created it
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User', // References the User model
    //     required: true
    // }
});

module.exports = mongoose.model('Post', postSchema);



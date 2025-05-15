var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./post');
const passport = require('passport');
const upload = require('./multer');

const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});

router.get('/feed', function (req, res, next) {
  res.render('feed');
});

router.post('/upload', isLoggedIn, upload.single('file'),async function (req, res) {
  if (!req.file) {
    return res.status(400).send("File not found");
  }
  const user = await userModel.findOne({ username: req.session.passport.user});
  const postdata = await postModel.create({
    postText: req.body.caption,
    image: req.file.filename,
    user: user._id 
  });
  user.posts.push(postdata._id);
  await user.save();
  res.redirect('/profile');
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  const userdets = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate('posts');
  res.render('profile', { user: userdets });
});

router.post('/register', function (req, res, next) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      });
    })
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) {

});

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;

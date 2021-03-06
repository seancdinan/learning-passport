// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to the app
module.exports = function(passport) {
	// PASSPORT SESISON SETUP =====================
	// required for persistent login sessions
	// passport needs ability to (un)serialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	
	// LOCAL SIGNUP (26)  ==============================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-signup', new LocalStrategy({
	  // by default, local strategy uses username & password, override with email 
	  usernameField: 'email',
	  passwordField: 'password',
	  passReqToCallback: true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done){
	  
	  // asynchronous
	  // User.findOne wont fire unless data is sent back
	  process.nextTick(function() {
		// find a user whose email is the same as the form
		// we are checking to see if the user already exists
		User.findOne({'local.email': email}, function(err, user){
		  if (err)
		    return done(err);

		  // check if there's already a user w/ that email
		  if (user){
		    return done(null, false, req.flash('signupMessage', 'That email is already taken'));
		  } else {
			// if there is no existing user
			// create the user
			var newUser = new User();

			// set the user's local credentials
			newUser.local.email = email;
			newUser.local.password = newUser.generateHash(password);

			// save the user
			newUser.save(function(err) {
			  if(err)
			    throw err;
			  return done(null, newUser);
			});
		}
	});
	});
    }));
};

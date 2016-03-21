module.exports = function(app, passport) {

	// HOME PAGE =================
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// LOGIN =====================
	// show the login form
	app.get('/login', function(req, res){
		// render the page and pass in any flash data
		res.render('login.ejs', {message: req.flash('loginMessage') });
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);

	// SIGNUP ====================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page, pass any flash data
		res.render('signup.ejs', {message: req.flash('signupMessage') });
	});

	// process the signup form
	 app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to secure profile
		failureRedirect: '/signup', // redirect back to signup
		failureFlash: true // allow flash messages
	}));

	// PROFILE SECTION ==========
	// we will want this protected so you have to log in to visit
	// we will use route middleware to verify this (isLoggedIn)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user // get the user out of session and pass to template
		});
	});

	// LOGOUT ==================
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};

	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {
		
		// if the user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();;

		// if they aren't, redirect to home page
		res.redirect('/');
	}


/**
 * Module dependencies.
 */

var express  = require('express'),
    routes   = require('./routes'),
    admin    = require('./routes/admin'),
    cards    = require('./routes/cards'),
    users    = require('./routes/users'),
    decks    = require('./routes/decks'),
    messages = require('./routes/messages'),
    http     = require('http'),
    path     = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt   = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var app = express();

app.set('mongodb-uri', process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/test');

app.db = mongoose.createConnection(app.get('mongodb-uri'));

app.db.once('open', function() {
	console.log('Mongoose open for business');
});

require('./models')(app, mongoose, bcrypt, SALT_WORK_FACTOR);

/*var test_user = new app.db.models.User({ "password": "password",
    "profile": {
        "username": "jharbaugh",
        "id": 1,
        "display_name": "Josh Harbaugh"
    },
    "saved_decks": [ {
        "deck_id": 1,
        "resource_uri": "/api/deck/1"
    } ] });
test_user.save(function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('user: ' + test_user.profile.username + " saved.");
  }
});*/

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {	
	app.db.models.User.findOne({ _id: id }).exec(function (err, user) {
		if(err) console.log(err);
		done(err, user);
	});
});

// Passport Strategy
passport.use(new LocalStrategy(
	function(username, password, done) {
		app.db.models.User.findOne({}).where('profile.username').equals(username).exec(function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
			user.comparePassword(password, function(err, isMatch) {
				if (err) return done(err);
				if(isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}
));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'this is a secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, '.tmp')));
app.use(function(req, res) {
  res.sendfile(__dirname + '/app/index.html');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Admin
app.get('/admin', admin.index);

app.get('/home', function(req, res){
	res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
	res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
	res.render('login', { user: req.user, message: req.session.messages });
});

// Passport Auth
app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err) }
		if (!user) {
			req.session.messages =  [info.message];
			return res.redirect('/login')
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/');
		});
	})(req, res, next);
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

// RESTful API
app.get('/api/cards', cards.list);

app.get('/api/users', users.list);
app.get('/api/user', ensureAuthenticated, function(req, res){
	res.json(200, req.user);
});
app.post('/api/user', function(req, res){
	var new_user = new app.db.models.User({ "password": req.body.password, "profile": { "username": req.body.username, "display_name": req.body.display_name }, "saved_decks": [] });
	new_user.save(function(err) {
	  if(err) {
	    res.json(200, { 'status': 'error', 'message': err });
	  } else {
	    res.json(200, { 'status': 'success', 'message': req.body.username + ' created successfully!' });
	  }
	});
});
app.get('/api/user/:id', users.getById);

app.get('/api/deck/:id', decks.getDeckById);
app.get('/api/decks', decks.list);
app.get('/api/decks/:username', decks.getDecksByUsername);

app.get('/api/messages/:username', messages.getByUsername);
app.get('/api/messages/:username/sent', messages.getSentByUsername);

// catch-all redirect to homepage
app.get('/api/*', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}

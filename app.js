
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
    fs       = require('fs'),
    request  = require('request'),
    AWS      = require('aws-sdk'),
    ironio   = require('node-ironio')('mKlVDXJnFUVIFDHEXkrxO6g8aDU'),
    project  = ironio.projects('52376a31fa13cc000900000a'),
    raven    = require('raven'),
    memjs    = require('memjs'),
    pkg = require('./package.json'),
    version = pkg.version,
    winston = require('winston'),
    Papertrail = require('winston-papertrail').Papertrail,
    SALT_WORK_FACTOR = 10;

var logger = new winston.Logger({
    transports: [
        new winston.transports.Papertrail({
            host: 'logs.papertrailapp.com',
            port: 14583
        })
    ]
});

var app = express();

var client = memjs.Client.create();

// IronCache
if ('development' == app.get('env')) {
    var c = project.caches('hsb-dev');
} else {
    var c = project.caches('hsb-prod');
}

app.set('mongodb-uri', process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/test');

app.db = mongoose.createConnection(app.get('mongodb-uri'));

app.db.once('open', function() {
    logger.info('Mongoose open for business');
    logger.info(app.get('mongodb-uri'));
});

require('./models')(app, mongoose, bcrypt, SALT_WORK_FACTOR);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {   
    app.db.models.User.findOne({ _id: id }).exec(function (err, user) {
        if(err) logger.info(err);
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
app.set('version', version);
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.use(require('bounscale'));
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieSession({secret: 'dfj3fk2i3lkjfsld92492kc0!fkjdf0249fk29#4dkf92j', cookie: { maxAge: 1000*60*60 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(raven.middleware.express('https://62b9f8a1d863427f9425e95e31051712:3e8ebb29977f4325b8b9fe34a328b137@app.getsentry.com/13667'));

// development only
if ('development' == app.get('env')) {
    logger.info('===Development===');
    app.use(express.favicon(path.join(__dirname, '/app/favicon.ico')));
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.static(path.join(__dirname, '.tmp')));
    app.use(function(req, res) {
        res.render( __dirname + '/app/index.html', { version: version } );
    });
    app.use(express.errorHandler());
} else {
    logger.info('===Production===');
    app.use(express.favicon(path.join(__dirname, '/dist/favicon.ico')));
    app.use(express.static(path.join(__dirname, 'dist')));
    app.use(express.static(path.join(__dirname, '.tmp')));
    app.use(function(req, res) {
        res.render( __dirname + '/dist/index.html', { version: version } );
    });
}

/* TEST FORCE ERROR
app.get('/error', function(req, res, next) {
    var err = 'final error message';
    next(err);
});*/

// Passport Auth
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.session.messages =  [info.message];
            return res.json(200, { 'status': 'error', 'message': info.message });
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json(200, { 'status': 'success', 'message': user.profile.display_name });
        });
    })(req, res, next);
});

app.get('/admin', ensureAdmin, function(req, res){
    app.use(express.static(path.join(__dirname, 'views')));
    app.use(express.static(path.join(__dirname, '.tmp')));
    res.render( __dirname + '/views/admin/index.html', { title: 'Hearthstone Builder', version: version } );
});

app.post('/api/logout', function(req, res){
    res.setTimeout(30 * 1000);
    req.logout();
    res.redirect('/');
});

// RESTful API
app.get('/api/cards', function(req, res, next) {
    res.setTimeout(30 * 1000);
    // Get an item from the cache
    try {
        c.get('cards', function(err, val) {
            if(err) res.json(200, { 'errno': err.errno, 'code': err.code, 'syscall': err.syscall });
            else {
                if(val) {
                    res.json(200, JSON.parse(val));

                    res.app.db.models.Card.find({}).sort({ name: 'asc' }).exec(function(err, response) {
                        if (err) next(err);
                        else {
                            c.put('cards', JSON.stringify(response), function(err) {
                                if(err) logger.info(err);
                            });
                        }
                    });
                } else {
                    res.app.db.models.Card.find({}).sort({ name: 'asc' }).exec(function(err, response) {
                        if (err) next(err);
                        else {
                            c.put('cards', JSON.stringify(response), function(err) {
                                if(err) next(err);
                                else res.json(200, response);
                            });
                        }
                    });
                }
            }
        });
    } catch(e) {
        res.app.db.models.Card.find({}).sort({ name: 'asc' }).exec(function(err, response) {
            if (err) next(err);
            else res.json(200, response);
        });
    }
});
app.get('/api/cards/images', cards.images);
app.get('/api/cards/images/download', function(req, res, next) {
    res.setTimeout(30 * 1000);
    res.app.db.models.Card.find({}, { _id: false, image: true }).exec(function(err, response) {
        if (err) next(err);
        else {
            var download = function(uri, filename){
                request({ 'uri': uri, 'encoding': 'binary' }, function(err, res, body) {
                    if(err) next(err);
                    logger.info('content-type:', res.headers['content-type']);
                    logger.info('content-length:', res.headers['content-length']);
                    logger.info('file:', filename);
                    fs.writeFileSync(filename, body, 'binary');
                });
            };
            for(var idx in response) {
                download('http://wow.zamimg.com/images/hearthstone/cards/enus/original/' + response[idx].image + '.png', 'app/images/cards/' + response[idx].image + '.png');
            }
        }
    });
});
app.get('/api/cards/class/:classId', function(req, res, next) {
    res.setTimeout(30 * 1000);
    // Get an item from the cache
    c.get('cards_class_' + req.params.classId, function(err, val) {
        if(err) res.json(200, { 'status': 'error' });
        if(val) {
            res.json(200, JSON.parse(val));

            res.app.db.models.Card.find({}).or([{classs:req.params.classId}, {classs: null}]).sort({ name: 'asc' }).exec(function(err, response) {
                if (err) next(err);
                else {
                    for(var i=0; i<response.length; i++) {
                        if(response[i].quality == 5) {
                            response[i].limit = 1;
                        } else {
                            response[i].limit = 2;
                        }
                    }
                    c.put('cards_class_' + req.params.classId, JSON.stringify(response), function(err) {
                        if(err) next(err);
                    });
                }
            });
        } else {
            res.app.db.models.Card.find({}).or([{classs:req.params.classId}, {classs: null}]).sort({ name: 'asc' }).exec(function(err, response) {
                if (err) next(err);
                else {
                    for(var i=0; i<response.length; i++) {
                        if(response[i].quality == 5) {
                            response[i].limit = 1;
                        } else {
                            response[i].limit = 2;
                        }
                    }
                    c.put('cards_class_' + req.params.classId, JSON.stringify(response), function(err) {
                        if(err) next(err);
                        else res.json(200, response);
                    });
                }
            });
        }
    });
});
app.get('/api/cards/type/:typeId', function(req, res, next) {
    res.setTimeout(30 * 1000);
    // Get an item from the cache
    c.get('cards_type_' + req.params.typeId, function(err, val) {
        if(err) res.json(200, { 'status': 'error' });
        if(val) {
            res.json(200, JSON.parse(val));

            res.app.db.models.Card.find({type:req.params.typeId}).sort({ name: 'asc' }).exec(function(err, response) {
                if (err) next(err);
                else {
                    for(var i=0; i<response.length; i++) {
                        if(response[i].quality == 5) {
                            response[i].limit = 1;
                        } else {
                            response[i].limit = 2;
                        }
                    }
                    c.put('cards_type_' + req.params.typeId, JSON.stringify(response), function(err) {
                        if(err) next(err);
                    });
                }
            });
        } else {
            res.app.db.models.Card.find({type:req.params.typeId}).sort({ name: 'asc' }).exec(function(err, response) {
                if (err) next(err);
                else {
                    for(var i=0; i<response.length; i++) {
                        if(response[i].quality == 5) {
                            response[i].limit = 1;
                        } else {
                            response[i].limit = 2;
                        }
                    }
                    c.put('cards_type_' + req.params.typeId, JSON.stringify(response), function(err) {
                        if(err) next(err);
                        else res.json(200, response);
                    });
                }
            });
        }
    });
});
app.get('/api/cards/type/:typeId/class/:classId', function(req, res, next) {
    res.setTimeout(30 * 1000);
    // Get an item from the cache
    c.get('cards_type_' + req.params.typeId + '_class_' + req.params.classId, function(err, val) {
        if(err) res.json(200, { 'status': 'error' });
        if(val) {
            res.json(200, JSON.parse(val));

            res.app.db.models.Card.find({type:req.params.typeId}).or([{classs:req.params.classId}, {classs: null}]).sort({ name: 'asc' }).exec(function(err, response) {
                if (err) next(err);
                else {
                    for(var i=0; i<response.length; i++) {
                        if(response[i].quality == 5) {
                            response[i].limit = 1;
                        } else {
                            response[i].limit = 2;
                        }
                    }
                    c.put('cards_type_' + req.params.typeId + '_class_' + req.params.classId, JSON.stringify(response), function(err) {
                        if(err) next(err);
                    });
                }
            });
        } else {
            res.app.db.models.Card.find({type:req.params.typeId}).or([{classs:req.params.classId}, {classs: null}]).sort({ name: 'asc' }).exec(function(err, response) {
                if (err) next(err);
                else {
                    for(var i=0; i<response.length; i++) {
                        if(response[i].quality == 5) {
                            response[i].limit = 1;
                        } else {
                            response[i].limit = 2;
                        }
                    }
                    c.put('cards_type_' + req.params.typeId + '_class_' + req.params.classId, JSON.stringify(response), function(err) {
                        if(err) next(err);
                        else res.json(200, response);
                    });
                }
            });
        }
    });
});
app.get('/api/card/:id', cards.getCardsById);

app.get('/api/users', users.list);
app.get('/api/user', ensureAuthenticated, function(req, res){
    res.setTimeout(30 * 1000);
    res.json(200, req.user);
});
app.post('/api/user', function(req, res){
    res.setTimeout(30 * 1000);
    var new_user = new app.db.models.User({ "password": req.body.password, "profile": { "username": req.body.username, "display_name": req.body.display_name, "avatar": "https://s3.amazonaws.com/hearthstonebuilder/avatars/default_gravatar.jpg" } });
    new_user.save(function(err) {
      if(err) {
        res.json(200, { 'status': 'error', 'message': err });
      } else {
        res.json(200, { 'status': 'success', 'message': req.body.username + ' created successfully!' });
      }
    });
});
app.get('/api/user/:username', users.getByUsername);
app.get('/api/user/:id', users.getById);
app.put('/api/user/:id', ensureAuthenticated, users.updateUser);
app.put('/api/user/:id/password', ensureAuthenticated, users.updateUserPassword);

app.get('/api/deck/:id', decks.getDeckById);
app.delete('/api/deck/:id', ensureAuthenticated, decks.deleteDeckById);
app.get('/api/decks', decks.list);
app.get('/api/decks/:username', decks.getDecksByUsername);
app.post('/api/decks/:username', ensureAuthenticated, decks.saveDeckToUsername);
app.put('/api/decks/:id', ensureAuthenticated, decks.updateDeck);
app.put('/api/decks/:id/rating', ensureAuthenticated, decks.updateDeckRating);

app.get('/api/messages/:username', ensureAuthenticated, messages.getByUsername);
app.get('/api/messages/:username/sent', ensureAuthenticated, messages.getSentByUsername);

app.post('/api/message', ensureAuthenticated, function(req, res){
    var message = req.body.message;
    var new_message = new app.db.models.Message({ "username": message.to, "message": message.message, "created": new Date(), "from": message.from, "subject": message.subject, "status": "new" });
    new_message.save(function(err) {
      if(err) {
        res.json(200, { 'status': 'error', 'message': err });
      } else {
        res.json(200, { 'status': 'success', 'message': 'Message sent!' });
      }
    });
});
app.delete('/api/message/:id', ensureAuthenticated, function(req, res){
    res.setTimeout(30 * 1000);
    res.app.db.models.Message.remove({ _id: req.params.id }).exec(function(err, response) {
        if (err) res.send(500, err);
        else {
            res.json(200, { 'status': 'success', 'message': 'Message deleted' });
        }
    });
});
app.put('/api/message/:id/status', ensureAuthenticated, messages.updateStatus);

// upload to S3
app.post('/api/upload', ensureAuthenticated, function(req, res, next){
    res.setTimeout(30 * 1000);
    AWS.config.loadFromPath('./aws.json');
    
    var s3 = new AWS.S3({computeChecksums: true});
    var params = { 
        Bucket: 'hearthstonebuilder', 
        Key: req.body.File, 
        ACL: 'private',
        ContentType: req.body.ContentType 
    };
    s3.getSignedUrl('putObject', params, function(err, signedUrl) {
        if(err) next(err);
        else res.json(200, { 'status': 'success', 'upload_url': signedUrl });
    }); 
});

// catch-all redirect to homepage
app.get('/api/*', routes.index);

http.createServer(app).on('connection', function(socket) {
  socket.setTimeout(30 * 1000); 
}).listen(app.get('port'), function(){
  logger.info('Express server listening on port ' + app.get('port'));
  logger.info('Node Version: ' + process.version);
  logger.info('App Version: ' + app.get('version'));
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

function ensureAdmin(req, res, next) {
    if(req.user.profile.username == 'jharbaugh') {
        if (req.isAuthenticated()) { return next(); }
    }
    res.redirect('/login')
}

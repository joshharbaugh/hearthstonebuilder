exports = module.exports = function(app, mongoose, bcrypt, SALT_WORK_FACTOR) {

    var CardSchema = new mongoose.Schema({
        last_modified: Date,
        name: String,
        id: Number,
        resource_uri: String,
        description: String,
        class: String,
        classs: String,
        type: String,
        cost: Number,
        attack: Number,
        health: Number,
        quality: Number,
        image: String,
        icon: String,
        limit: Number,
        qty: Number,
        remaining: Number
    });

    app.db.model('Card', CardSchema);

    var DeckSchema = new mongoose.Schema({
        name: String,
        description: String,
        class: String,
        author: String,
        username: String,
        created: Date,
        last_modified: Date,
        rating: Number,
        length: Number,
        cards: [CardSchema]
    });

    app.db.model('Deck', DeckSchema);

    var UserSchema = new mongoose.Schema({
        password: {type: String, required: true},
        profile: {username: {type: String, required: true, unique: true}, display_name: String, avatar: String},
        votes: []
    });

    UserSchema.pre('save', function(next) {
        var user = this;

        if(!user.isModified('password')) return next();

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    });

    // Password verification
    UserSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if(err) return cb(err);
            cb(null, isMatch);
        });
    };

    app.db.model('User', UserSchema);

    var MessageSchema = new mongoose.Schema({
        username: String,
        id: Number,
        resource_uri: String,
        message: String,
        from: String,
        subject: String,
        status: String,
        created: Date
    });

    app.db.model('Message', MessageSchema);

}
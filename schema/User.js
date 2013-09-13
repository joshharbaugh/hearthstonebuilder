exports = module.exports = function(app, mongoose, bcrypt, SALT_WORK_FACTOR) {

    var UserSchema = new mongoose.Schema({
        password: {type: String, required: true},
        profile: {username: {type: String, required: true, unique: true}, display_name: String, avatar: String},
        saved_decks: [{deck_id: Number, resource_uri: String}]
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

}
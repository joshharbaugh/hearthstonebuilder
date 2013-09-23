exports = module.exports = function(app, mongoose, bcrypt, SALT_WORK_FACTOR) {
	
	// db schema
	require('./schema/App')(app, mongoose, bcrypt, SALT_WORK_FACTOR);

	// card db schema
	//require('./schema/Card')(app, mongoose);

	// deck db schema
	//require('./schema/Deck')(app, mongoose);

	// message db schema
	//require('./schema/Message')(app, mongoose);

}
exports = module.exports = function(app, mongoose, bcrypt, SALT_WORK_FACTOR) {
	
	// card db schema
	require('./schema/Card')(app, mongoose);

	// deck db schema
	require('./schema/Deck')(app, mongoose);

	// user db schema
	require('./schema/User')(app, mongoose, bcrypt, SALT_WORK_FACTOR);

	// message db schema
	require('./schema/Message')(app, mongoose);

}
exports = module.exports = function(app, mongoose, bcrypt, SALT_WORK_FACTOR) {
	
	// db schema
	require('./schema/App')(app, mongoose, bcrypt, SALT_WORK_FACTOR);

}
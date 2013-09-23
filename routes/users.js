/*
 * GET users
 */

exports.list = function(req, res){
	res.setTimeout(30 * 1000);
	res.app.db.models.User.find({}).exec(function(err, response) {
		if (err) res.send(500, err);
		else res.json(200, response);
	});
};

exports.getById = function(req, res){
	res.setTimeout(30 * 1000);
	res.app.db.models.User.findOne({ _id: req.params.id }).exec(function(err, response) {
		if (err) res.send(500, err);
		else res.json(200, response);
	});
};

exports.getByUsername = function(req, res){
	res.setTimeout(30 * 1000);
	res.app.db.models.User.findOne({ 'profile.username': req.params.username }).exec(function(err, response) {
		if (err) res.send(500, err);
		else res.json(200, response);
	});
};

exports.updateUser = function(req, res){
	res.setTimeout(30 * 1000);
	var avatar = req.body.avatar.split('?');
	res.app.db.models.User.update({ _id: req.params.id }, { 'profile.avatar': avatar[0] }, { upsert: true }, function (err, numberAffected, raw) {
		if (err) {
			res.json(200, { 'status': 'error', 'data': err });
		} else {
			console.log('The number of updated documents was %d', numberAffected);
			console.log('The raw response from Mongo was ', raw);
			res.json(200, { 'status': 'success', 'message': raw });
		}
	});
};

exports.updateUserPassword = function(req, res){
	res.setTimeout(30 * 1000);
	res.app.db.models.User.findOne({ _id: req.params.id }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			response.password = req.body.password;
			response.save(function(err) {
				if(err) {
					res.json(200, { 'status': 'error', 'message': err });
				} else {
					res.json(200, { 'status': 'success', 'message': 'Password updated successfully!' });
				}
			});
		}
	});
};
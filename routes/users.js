/*
 * GET users
 */

exports.list = function(req, res){
	res.app.db.models.User.find({}).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getById = function(req, res){
	res.app.db.models.User.findOne({}).where('profile.id').equals(req.params.id).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};
exports.getByUsername = function(req, res){
	res.setTimeout(30 * 1000);
	res.app.db.models.Message.find({username:req.params.username}).sort({ created: 'desc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getSentByUsername = function(req, res){
	res.setTimeout(30 * 1000);
	res.app.db.models.Message.find({from:req.params.username}).sort({ created: 'desc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.updateStatus = function(req, res){
	res.setTimeout(30 * 1000);
	var message = req.body;
	res.app.db.models.Message.update({ _id: req.params.id }, { 'status': req.body.status }, function (err, numberAffected, raw) {
		if(err) res.send(500, err);
		else {
			res.json(200, {});
		}
	});
};
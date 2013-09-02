/*
 * GET cards
 */

exports.list = function(req, res){
	res.app.db.models.Card.find({}).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getCardsByClass = function(req, res){
	res.app.db.models.Card.find({}).or([{classs:req.params.classId}, {classs: null}]).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getCardsByType = function(req, res){
	res.app.db.models.Card.find({type:req.params.typeId}).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getCardsByTypeAndClass = function(req, res){
	res.app.db.models.Card.find({type:req.params.typeId}).or([{classs:req.params.classId}, {classs: null}]).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};
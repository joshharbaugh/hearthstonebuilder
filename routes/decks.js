/*
 * GET decks
 */

exports.list = function(req, res){
	res.app.db.models.Deck.find({}).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getDeckById = function(req, res){
	res.app.db.models.Deck.findOne({id:req.params.id}).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getDecksByUsername = function(req, res){
	res.app.db.models.Deck.find({username:req.params.username}).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};
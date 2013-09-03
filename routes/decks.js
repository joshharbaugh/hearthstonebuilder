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
	res.app.db.models.Deck.findOne({ _id: req.params.id }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.deleteDeckById = function(req, res){
	res.app.db.models.Deck.remove({ _id: req.params.id }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getDecksByUsername = function(req, res){
	res.app.db.models.Deck.find({ username: req.params.username }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.saveDeckToUsername = function(req, res){
	var requestPayload = req.body;
	res.app.db.models.Deck.findOne({ name: req.body.name }, function (err, doc) {
		console.log(doc);
		if (err) {
			res.json(200, { 'status': 'error', 'message': err });
		}
		doc = new res.app.db.models.Deck(requestPayload);
		doc.save(function(err) {
		  if(err) {
		    res.json(200, { 'status': 'error', 'message': err });
		  } else {
		    res.json(200, { 'status': 'success', 'message': req.body.name + ' deck saved successfully!' });
		  }
		});
	});
};
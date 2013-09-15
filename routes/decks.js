/*
 * GET decks
 */

exports.list = function(req, res){
	res.app.db.models.Deck.find({}).sort({ rating: 'desc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getDeckById = function(req, res){
	res.app.db.models.Deck.findOne({ _id: req.params.id }, function(err, deck) {
		if (err) res.send(500, err);
		else {
			res.json(200, deck);
		}
	});
};

exports.deleteDeckById = function(req, res){
	res.app.db.models.Deck.remove({ _id: req.params.id }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, { 'status': 'success', 'message': 'Deck removed' });
		}
	});
};

exports.getDecksByUsername = function(req, res){
	res.app.db.models.Deck.find({ username: req.params.username }).sort({ rating: 'desc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.saveDeckToUsername = function(req, res){
	var requestPayload = req.body;
	console.log(requestPayload);
	res.app.db.models.Deck.findOne({ name: req.body.name }, function (err, doc) {
		if (err) {
			res.json(200, { 'status': 'error', 'data': err });
		}
		doc = new res.app.db.models.Deck(requestPayload);
		doc.rating = 0;
		doc.created = new Date(); 
		doc.save(function(err) {
		  if(err) {
		    res.json(200, { 'status': 'error', 'data': err });
		  } else {
		    res.json(200, { 'status': 'success', 'message': req.body.name + ' deck saved successfully!' });
		  }
		});
	});
};

exports.updateDeck = function(req, res){
	var o = req.body;
	res.app.db.models.Deck.update({ _id: req.params.id }, { author: o.author, cards: o.cards, class: o.class, last_modified: new Date(), description: o.description, name: o.name, length: o.length }, { upsert: true }, function (err, numberAffected, raw) {
		if (err) {
			res.json(200, { 'status': 'error', 'data': err });
		} else {
			console.log('The number of updated documents was %d', numberAffected);
			console.log('The raw response from Mongo was ', raw);
			res.json(200, { 'status': 'success', 'message': req.body.name + ' deck updated successfully!' });
		}		
	});
};

exports.updateDeckRating = function(req, res){
	var o = req.body;
	res.app.db.models.Deck.update({ _id: req.params.id }, { rating: o.rating }, { upsert: true }, function (err, numberAffected, raw) {
		if (err) {
			res.json(200, { 'status': 'error', 'data': err });
		} else {
			res.app.db.models.User.update({ _id: o.user_id }, { $addToSet: { votes: o.deck_id } }, { upsert: true }, function (err, numberAffected, raw) {
				if (err) {
					res.json(200, { 'status': 'error', 'data': err });
				} else {
					res.json(200, { 'status': 'success', 'message': 'Rating updated successfully!', 'raw': raw });
				}
			});
		}
	});
};
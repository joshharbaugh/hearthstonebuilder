/*
 * GET cards
 */

exports.list = function(req, res){
	res.app.db.models.Card.find({}).sort({ name: 'asc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.images = function(req, res){
	res.app.db.models.Card.find({}, { _id: false, image: true }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			res.json(200, response);
		}
	});
};

exports.getCardsById = function(req, res){
	res.app.db.models.Card.find({ _id: req.params.id }).sort({ name: 'asc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			for(var i=0; i<response.length; i++) {
				if(response[i].quality == 5) {
					response[i].limit = 1;
				} else {
					response[i].limit = 2;
				}
			}
			res.json(200, response);
		}
	});
};

exports.getCardsByClass = function(req, res){
	res.app.db.models.Card.find({}).or([{classs:req.params.classId}, {classs: null}]).sort({ name: 'asc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			for(var i=0; i<response.length; i++) {
				if(response[i].quality == 5) {
					response[i].limit = 1;
				} else {
					response[i].limit = 2;
				}
			}					
			res.json(200, response);
		}
	});
};

exports.getCardsByType = function(req, res){
	res.app.db.models.Card.find({type:req.params.typeId}).sort({ name: 'asc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			for(var i=0; i<response.length; i++) {
				if(response[i].quality == 5) {
					response[i].limit = 1;
				} else {
					response[i].limit = 2;
				}
			}
			res.json(200, response);
		}
	});
};

exports.getCardsByTypeAndClass = function(req, res){
	res.app.db.models.Card.find({type:req.params.typeId}).or([{classs:req.params.classId}, {classs: null}]).sort({ name: 'asc' }).exec(function(err, response) {
		if (err) res.send(500, err);
		else {
			for(var i=0; i<response.length; i++) {
				if(response[i].quality == 5) {
					response[i].limit = 1;
				} else {
					response[i].limit = 2;
				}
			}
			res.json(200, response);
		}
	});
};
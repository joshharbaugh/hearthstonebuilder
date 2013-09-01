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
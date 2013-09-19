
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.setTimeout(30 * 1000);
  res.json(500, { error: 'resource not found' });
};
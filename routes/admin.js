
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.setTimeout(30 * 1000);
  res.render('admin/index', { title: 'Admin' });
};
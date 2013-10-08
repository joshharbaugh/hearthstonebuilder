
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render( 'views/admin/index.html', { title: 'Admin', version: res.app.get('version') } );
};

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'CAR TEST' });
};

exports.db = function(req, res) {
    res.render('index', {
            title : "Some test"
        }
    )
}
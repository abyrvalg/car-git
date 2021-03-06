
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

l = console.log

getUser = function(db, name, callback) {
    var users = db.collection("users")
    return users.find({name : name}).toArray(callback);
}

var MongoClient = require('mongodb').MongoClient;
// Connect to the db
DB = {
    addr : 'localhost',
    port : '27017',
    name : 'test'
}
MongoClient.connect("mongodb://"+ DB.addr +":" + DB.port +"/"+DB.name, function(err, db) {
    if(!err) {
        console.log("We are connected");
        l(getUser(db, "test", function(a,b){
l(b)
           }));
    } else {
        console.log("Beda")
    }
});

app.get('/', routes.index);
app.get('/db', routes.db);
app.get('/users', user.list);

app.get('/php', function(req, res) {
    var exec = require("child_process").exec;
    var scriptName = 'get_json.php'
    exec("php php_scripts/" + scriptName,
        function (error, stdout, stderr) {
            var url = require('url');
            var urlData = url.parse(req.url, true);
            console.log(urlData.query.glo);
            if(urlData.query.glo) {
                global.testVar = urlData.query.glo;
            }
            res.render('customer', {
                title : 'O_O',
                testVar : global.testVar || 100,
                data : JSON.parse(stdout)
            });
        }
    );
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

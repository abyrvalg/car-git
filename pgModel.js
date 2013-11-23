var pg = require('pg'); 
var dbConnectionConfig = { host: 'localhost', user: 'car', password: 'qwerty', database: 'destination' };
var conString = "postgres://car:qwerty@localhost/destination";
var client = new pg.Client(conString);

client.pQuery = function(query, params, callback){
	if(query && params && callback) {
		this.query(query.replace(/\$(\d+)/g, function(m1, m2){
			return (""+params[m2]).replace(/(\"|\')/g, "\\$1") || m1;
		}), callback);
	}
	else {
		callback("some of query, params, callback input parameter isn't passed");
	}
}

client.connect(function(err) {
	if(err) {
	return console.error('could not connect to postgres', err);
	}
});


exports.connect = client.connect;
exports.addOrGetUser = function(socialNetworkId, profile, callback) {
	client.pQuery("select id, first_name, last_name, karma from dest.users where id = \
	(select user_id from dest.user_social where social_id='$0'  and social_type_id = '$1')", [profile.id, socialNetworkId],
	function(err, result){
		if(result && !result.rowCount > 0) {
			client.pQuery("with row as (insert into dest.users (first_name, last_name) values('$0', '$1') RETURNING id)\
			insert into dest.user_social (social_id, social_type_id, user_id)\
			select '$2' as social_id, '$3' as social_type_id, u.id as user_id from row as u",
			[profile._json.first_name, profile._json.last_name, profile.id, socialNetworkId],
			function(err, result){
				callback(err, profile);
			});
		}
		else{
			callback(err, result);
		}
	});
};
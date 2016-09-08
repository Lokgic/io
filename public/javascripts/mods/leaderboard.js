var draw = function drawHTML(game, location){
		ping(game, function(data){
			var html = '<table class="table table-hover"><thead class="thead-inverse"><tr><th>#</th><th>Name</th><th>Score</th></tr></thead><tbody>';
			var k = 1;
			for (object in data){
				html += '<tr><th score="row"> ' + k + '</th>';
				html += '<td class = "lead">' + data[object].name +'</td>';
				html += '<td class = "lead">' + data[object].score +'</td>'
				
				html += '</tr>'
				k++;
			}
			html += '</tbody></table>'
			location.html(html);
		})
	}

var ping = function ping(game, callback){
		jQuery.post("../ranking", {game:game}, function (res){
			return callback(res);
		})
	}


var all = {
	draw: draw,
	ping: ping
}
module.exports = all;
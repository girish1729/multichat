var fs = require('fs');
var path = require('path');

exports.index = function(req, res) {

    fs.readFile(path.join(__dirname, "../public/chat4.html"), 'utf8', function(err, data) {
	if (err) throw err;
	res.writeHead(200);
	res.end(data);
    });
};

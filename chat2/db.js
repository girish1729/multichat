var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'panache',
  database: 'users'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('Connected to DB ');
});

connection.query('SELECT * from chatusers;', function(err, rows, fields)
{
  if (err) throw err;

	for(var i = 0; i < rows.length;i++) {
  		console.log('The chat user is: ', rows[i].name);
  		console.log('The chat password is: ', rows[i].password);
	}
});

connection.end();

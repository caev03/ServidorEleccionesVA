var express    = require("express");
var mysql      = require('mysql');

var app = express();

var connection = mysql.createConnection({
  host     : 'visualanalyticsdb.cnjlh5mbaxaj.us-west-2.rds.amazonaws.com',
  user     : 'imjh_vaua',
  password : 'J8eFb5cXohkj',
  database : 'EleccionesDB'
});

    connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log(err);
    console.log("Error connecting database ... nn");    
}
});

app.get("/",function(req,res){
	
connection.query('SELECT * from EleccionesDB.Party_codes LIMIT 5', function(err, rows, fields) {
  if (!err){
  	console.log('The solution is: ', rows);
	res.send(rows);
  }
  else
    console.log('Error while performing Query.');
  });
});

app.get("/end", function(req,res){
    console.log("cerrando connection")
    connection.end();
    res.send("Hola");
});

app.listen(3000);
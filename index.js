var express    = require("express");
var mysql      = require('mysql');
var fs         = require('fs');
var jsonn      = require('./rsrc/colombia.geo.json')

var app = express();

var connection = mysql.createConnection({
    host     : 'visualanalyticsdb.cjy6gexdayda.us-west-2.rds.amazonaws.com',
    user     : 'imjh_vaua',
    password : 'loZpapuZ321',
    database : 'EleccionesDB'
});

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
        console.log("http://localhost:3000")
    } else {
        console.log("Error connecting database ... nn");
        console.log(err);
    }
});

app.get("/",function(req,res){

    connection.query('SELECT * from EleccionesDB.Party_codes LIMIT 5', function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.')
            console.log(err)
        }

    });
});

app.get("/dptos", function(req,res){
    connection.query('SELECT * FROM EleccionesDB.Dpto_codes', function(err, rows, fields){
        if(!err){
            console.log('GET/ Dpto_codes');
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.')
            console.log(err)
        }
    })
})

app.get("/mncps", function(req,res){
    connection.query('SELECT * FROM EleccionesDB.Muni_codes', function(err, rows, fields){
        if(!err){
            console.log('GET/ Muni_codes');
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.')
            console.log(err)
        }
    })
})

app.get("/elctnTp", function(req,res){
    connection.query('SELECT * FROM EleccionesDB.Elec_type_codes', function(err, rows, fields){
        if(!err){
            console.log('GET/ Elec_type_codes');
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.')
            console.log(err)
        }
    })
})

app.get("/prt", function(req,res){
    connection.query('SELECT * FROM EleccionesDB.Party_codes', function(err, rows, fields){
        if(!err){
            console.log('GET/ Party_codes');
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.')
            console.log(err)
        }
    })
})


app.get("/end", function(req,res){
    console.log("cerrando connection")
    connection.end();
    process.exit()
    app.close()
});

app.get("/mapColombia", function(req,res){
    console.log('GET/ mapColombia');
    res.send(jsonn)
});

app.get("/colombianMapFOption/:paramms", function (req,res) {
    var par = req.params.paramms
    console.log(par);
    par1 = par.split(":")
    connection.query("CALL colombianMapOpcion1('"+par1[0]+"','"+parseInt(par1[1])+"')",function(err, rows, fields){
        if(!err){
            console.log('GET/ colombianMapFOption');
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.')
            console.log(err)
        }
    })
})
app.get("/mapBetterYearFOption/:paramms",function (req,res) {
    var par = req.params.paramms
    connection.query("CALL mapBetterYearFOption('"+par+"')",function (err,rows,fields) {
        if(!err){
            console.log('GET/ mapBetterYearFOption');
            if(rows[0].length>0){
                res.send(""+rows[0][0].year)
            }
            else{
                res.send(""+1958)
            }
        }
        else{
            console.log('Error while performing Query.')
            console.log(err)
        }
    })
})
app.get("/colombianMapSOption/:paramms", function (req,res) {
    var par = req.params.paramms
    console.log(par);
    par1 = par.split(":")
    connection.query("CALL colombianMapOpcion2('"+par1[0]+"','"+parseInt(par1[1])+"')",function(err, rows, fields){
        if(!err){
            console.log('GET/ colombianMapSOption');
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.')
            console.log(err)
        }
    })
})

function assignDefaultValues( dataset )
{
    var defaultValue = 0;
    var keys = [ "ALCALDE", "ASAMBLEA DEPARTAMENTAL", "CAMARA", "CONCEJO MUNICIPAL", "GOBERNADOR", "PRESIDENTE", "PRESIDENTE (SEGUNDA VUELTA)", "SENADO"];
    var hadData = [ true, true, true];
    var newData = [];
    var previousdate = new Date();
    var sortByDate = function(a,b){ return a.year > b.year ? 1 : -1; };
    dataset.sort(sortByDate);
    dataset.forEach(function(row){
        if(row.year.valueOf() !== previousdate.valueOf()){
            for(var i = 0 ; i < keys.length ; ++i){
                if(hadData[i] === false){
                    newData.push( { elec_type_name: keys[i],
                        cantidad: defaultValue,
                        year: previousdate });
                }
                hadData[i] = false;
            }
            previousdate = row.year;
        }
        hadData[keys.indexOf(row.elec_type_name)] = true;
    });
    for( i = 0 ; i < keys.length ; ++i){
        if(hadData[i] === false){
            newData.push( { elec_type_name: keys[i], cantidad: defaultValue,
                year: previousdate });
        }
    }
    return dataset.concat(newData).sort(sortByDate);
}

app.get("/streamgraph/:userLastName", function(req,res,fields){
    var userLastName = req.params.userLastName;
    //var ws = fs.createWriteStream('sample.csv');
    connection.query('Select elec_type_name, count(*) as cantidad, year from (select *,count(*),concat(year,elec_type,muni_code,ifnull(first_lastname,""),ifnull(second_lastname,""),name) as full_name from Votaciones where seats = 1  and (first_lastname = "'+userLastName+'" or second_lastname = "'+userLastName+'") and votes >= 0 group by full_name) as resp join Elec_type_codes as etc on resp.elec_type = etc.elec_type  group by year,etc.elec_type order by elec_type_name, year', function(err, rows, fields){
        if(!err){
            console.log('GET/ Party_codes');
            var nose = assignDefaultValues(rows);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader('content-type', 'text/json');
            res.send(nose);
        }
        else{
            console.log(err)
            console.log('Error while performing Query.')
            res.send("error")
        }
    })
})

app.get("/lastnamesByYear", function(req,res){
    var lastname = req.query.lastname;
    connection.query('SELECT EleccionesDB.Votaciones.year, COUNT(*) AS value FROM EleccionesDB.Votaciones WHERE (first_lastname="'+lastname+'") and seats=1 group by EleccionesDB.Votaciones.year', function(err, rows, fields){
        if(!err){
            console.log('GET/ lastname '+lastname+' by year');
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.')
            res.send("error")
        }
    })
})

app.listen(3000);
// Basic Setup
var http     = require('http'),
express  = require('express'),
mysql    = require('mysql'),
parser   = require('body-parser');


//Database Connection
// var connection = mysql.createConnection({
//   host     : 'us-cdbr-iron-east-05.cleardb.net',
//   user     : 'bc25561c4d7046',
//   password : '017038aa',
//   database : 'heroku_eecbd9de5c4c545'
// });

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '',
  password : '',
  database : 'test'
});
try {
  connection.connect();
  
} catch(e) {
  console.log('Database Connetion failed:' + e);
}

// Setup express
var app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/frontend',  express.static(__dirname + '/frontend'));

app.get('/',function(req,res){
    res.sendFile('index.html',{'root': __dirname + '/frontend'});
})

//getUserById
app.get('/api/user/:id', function (req,res) {
  var id = req.params.id;
 
  connection.query('SELECT * from user where user_id = ?', [id], function(err, rows, fields) {
      if (!err){
        var response = [];
 
      if (rows.length != 0) {
        response.push({'result' : 'success', 'data' : rows});
      } else {
        response.push({'result' : 'error', 'msg' : 'No Results Found'});
      }
 
      res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
  });
})

//getAllCourses
app.get('/api/courses', function (req, res) {
  connection.query('SELECT * from course', function(err, rows, fields) {
    if (!err){
        var response = [];
 
      if (rows.length != 0) {
        response.push({'result' : 'success', 'data' : rows});
      } else {
        response.push({'result' : 'error', 'msg' : 'No Results Found'});
      }
 
      res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
  });
})

// app.get('/api/user/:id/enrolled', function (req,res) {
//   var id = req.params.id;
 
//   connection.query('SELECT * from user where user_id = ?', [id], function(err, rows, fields) {
//       if (!err){
//         var response = [];
 
//       if (rows.length != 0) {
//         response.push({'result' : 'success', 'data' : rows});
//       } else {
//         response.push({'result' : 'error', 'msg' : 'No Results Found'});
//       }
 
//       res.setHeader('Content-Type', 'application/json');
//         res.status(200).send(JSON.stringify(response));
//       } else {
//         res.status(400).send(err);
//       }
//   });
// })




// Create server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});


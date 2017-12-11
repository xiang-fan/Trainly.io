// Basic Setup
var http     = require('http'),
express  = require('express'),
mysql    = require('mysql'),
parser   = require('body-parser'),
password = require('password-hash-and-salt');


// var pool = mysql.createPool({
//   connectionLimit : 10,
//   host     : 'us-cdbr-iron-east-05.cleardb.net',
//   user     : 'bc25561c4d7046',
//   password : '017038aa',
//   database : 'heroku_eecbd9de5c4c545',
//   debug    :  false
// });   

var pool = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'trainlyio',
  debug    :  false
}); 

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
app.exports = pool;

//All APIs impleted here

//getUserById
app.get('/api/user/:id', function (req,res) {
  var id = req.params.id;
  var sql = 'SELECT * FROM user left join faculty on user.user_id = faculty_id left join administrator on user.user_id = administrator.admin_id where user_id = ?';

  pool.getConnection(function(err,connection){
    connection.query(sql, [id], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
    });
  });
  });
//register
//https://dummyimage.com/400x400/000/fff&text=
app.put('/api/register', function (req,res) {
  var email = req.body.email;
  var pwd = req.body.password;
  //var pic = req.body.pic;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var street = req.body.street;
  var city = req.body.city;
  var country = req.body.country;
  var zipcode = req.body.zipcode;


  var sql = 'INSERT INTO USER (`email`, `hash_pw`, `profile_pic`, `f_name`, `l_name`, `street`, `city`, `country`,`postal_code`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';

  pool.getConnection(function(err,connection){

    password(pwd).hash(function(error, hash) {
      if(error)
        throw new Error('Something went wrong!');

      // Store hash (incl. algorithm, iterations, and salt) 
      console.log(hash);

      connection.query(sql, [email, hash, 'https://dummyimage.com/400x400/000/fff&text=' + email, fname, lname, street, city, country, zipcode], function(err, rows, fields) {
        
        connection.query('SELECT user_id FROM USER WHERE email = ?', [email], function(err, rows, fields) {
          connection.release();
          var response = [];


          if (rows.length != 0) {
            response.push({'result' : 'success', 'data' : rows});
            res.status(200).send(JSON.stringify(response));
          } else {
            response.push({'result' : 'error', 'msg' : 'No Results Found'});
          }
        });
      });
    });
  });
})

app.put('/api/registerfaculty', function (req,res) {
  var email = req.body.email;
  var title = req.body.title;
  var affiliation = req.body.affiliation;
  var website = req.body.website;
  var sql = 'INSERT INTO FACULTY (`faculty_id`, `title`, `affiliation`, `website`, `date_time`) VALUES ((SELECT user_id FROM USER WHERE email = ?), ?, ?, ?, NOW())';
  console.log(email);
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [email, title, affiliation, website], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
})

app.put('/api/registeradmin', function (req,res) {
  var email = req.body.email;
  var sql = 'INSERT INTO ADMINISTRATOR (`admin_id`, `date_time`) VALUES ((SELECT user_id FROM USER WHERE email = ?), NOW());';
  console.log(email);
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [email], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
})



app.put('/api/login', function (req, res) {
  var username = req.body.username;
  var pwd = req.body.password;
  pool.getConnection(function(err,connection){
    // password('Qg8kzpeVEW').hash(function(error, hash) {
    //   if(error)
    //     throw new Error('Something went wrong!');

    //   // Store hash (incl. algorithm, iterations, and salt) 
    //   console.log(hash);
    // });
    connection.query('select * from user where user.email = ?', [username], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          password(pwd).verifyAgainst(rows[0].hash_pw, function(error, verified) {
            if(error)
              res.status(400).send(error);
            if(!verified) {
              res.status(400).send("Do not play with fire!");
            } else {
              response.push({'result' : 'success', 'data' : rows});
              res.status(200).send(JSON.stringify(response));
            }
          });
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
      } else {
        res.status(400).send(err);
      }
    });
  });
})

//getAllCourses
app.get('/api/user/:uid/courses', function (req, res) {
  var uid = req.params.uid;
  pool.getConnection(function(err,connection){
    connection.query('select course.course_id, course.description, course.name, course.icon, course.cost, (enrolled.user_id is not NULL) as enrolled, (interested.user_id is not NULL) as interested from course left join user on user.user_id = ? left join enrolled on course.course_id = enrolled.course_id and user.user_id = enrolled.user_id left join interested on interested.user_id = user.user_id and interested.course_id = course.course_id', [uid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
    });
  });
})

//get faculty waiting list
app.get('/api/getfacultywl/:uid', function (req, res) {
  var uid = req.params.uid;
  pool.getConnection(function(err,connection){
    connection.query('select * from faculty where faculty.grantor_id is NULL and faculty.faculty_id != ?', [uid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
    });
  });
})

//get account history
app.get('/api/gethistory/:uid', function (req, res) {
  var uid = req.params.uid;
  pool.getConnection(function(err,connection){
    connection.query('SELECT USER.user_id, COURSE.course_id, ENROLLED.start_time, ENROLLED.end_time, COURSE.cost, ENROLLED.payment_code FROM USER INNER JOIN ENROLLED ON USER.user_id = ENROLLED.user_id INNER JOIN COURSE ON COURSE.course_id = ENROLLED.course_id WHERE USER.user_id = ?', [uid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
    });
  });
})

//get total cost
app.get('/api/gettotalcost/:uid', function (req, res) {
  var uid = req.params.uid;
  pool.getConnection(function(err,connection){
    connection.query('SELECT USER.user_id, user.f_name, user.l_name, SUM(COURSE.cost) AS total_spent FROM USER INNER JOIN ENROLLED ON USER.user_id = ENROLLED.user_id INNER JOIN COURSE ON ENROLLED.course_id = COURSE.course_id WHERE USER.user_id = ? GROUP BY user_id', [uid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
    });
  });
})

//get admin waiting list
app.get('/api/getadminwl/:uid', function (req, res) {
  var uid = req.params.uid;
  pool.getConnection(function(err,connection){
    connection.query('select * from administrator where administrator.grantor_id is NULL and administrator.admin_id != 1 and administrator.admin_id != ?', [uid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
    });
  });
})

app.put('/api/enrollcourse', function (req,res) {
  var uid = req.body.uid;
  var cid = req.body.cid;
  var sql = 'INSERT INTO ENROLLED (`user_id`, `course_id`, `start_time`, `payment_code`) VALUES (?, ?, NOW(), LEFT(UUID(), 8))';
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [uid, cid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
})

app.put('/api/interestcourse', function (req,res) {
  var uid = req.body.uid;
  var cid = req.body.cid;
  var sql = 'Insert into interested (user_id, course_id) values (?, ?)';
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [uid, cid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
})

app.put('/api/disinterestcourse', function (req,res) {
  var uid = req.body.uid;
  var cid = req.body.cid;
  var sql = 'delete from interested where interested.user_id = ? and interested.course_id = ?';
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [uid, cid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
  
})



app.get('/api/user/:uid/mycourses', function (req, res) {
  

  pool.getConnection(function(err,connection){
    var uid = req.params.uid;
    if (err) {
      console.log('Database Connetion failed:' + err);
      res.status(400).send(err);
    }  
    connection.query('SELECT COURSE.name, COURSE.course_id, ENROLLED.complete, course.topic, GROUP_CONCAT(secondary_topic.name) AS secondary_topics FROM USER INNER JOIN ENROLLED ON USER.user_id = ENROLLED.user_id INNER JOIN COURSE ON ENROLLED.course_id = COURSE.course_id inner join secondary_topic on course.course_id = secondary_topic.course_id WHERE USER.user_id = ? group by course_id ORDER BY ENROLLED.complete', [uid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } 
    });  
  });
});

app.get('/api/user/:uid/myinterestedcourses', function (req, res) {

  pool.getConnection(function(err,connection){
    if (err) {
      console.log('Database Connetion failed:' + err);
      res.status(400).send(err);
    }
    var uid = req.params.uid;
    connection.query('SELECT COURSE.name, COURSE.course_id, course.topic, GROUP_CONCAT(secondary_topic.name) AS secondary_topics FROM USER INNER JOIN INTERESTED ON USER.user_id = INTERESTED.user_id INNER JOIN COURSE ON COURSE.course_id = INTERESTED.course_id inner join secondary_topic on course.course_id = secondary_topic.course_id WHERE USER.user_id = ? group by course_id', [uid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      }
    });  
  });
});
app.get('/api/user/:uid/course/:cid/incompleted', function (req, res) {
  pool.getConnection(function(err,connection){
    var uid = req.params.uid;
    var cid = req.params.cid;
    var sql = 'select user.user_id, enrolled.course_id, material.material_id AS incompleted_material_id, material.material_name AS incompleted_material_name, link.url, link.video_tag, post.text, downloadable_file.path, downloadable_file.type, downloadable_file.size from user inner join enrolled on user.user_id = enrolled.user_id and enrolled.complete is NULL inner join material on enrolled.course_id = material.course_id LEFT JOIN (select completed_materials.material_id as completed_id from user inner join enrolled on user.user_id = enrolled.user_id and enrolled.complete is NULL inner join material on enrolled.course_id = material.course_id inner join completed_materials on user.user_id = completed_materials.user_id and completed_materials.material_id = material.material_id where user.user_id = ?) a on material.material_id = a.completed_id left join link on material.material_id = link.material_id left join post on material.material_id = post.material_id left join downloadable_file on material.material_id = downloadable_file.material_id where user.user_id = ? and enrolled.course_id = ? and a.completed_id is NULL';
    if (err) {
      console.log('Database Connetion failed:' + err);
      res.status(400).send(err);
    }  
    connection.query(sql, [uid, uid, cid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } 
    });  
  });
});

app.get('/api/user/:uid/course/:cid/completed', function (req, res) {
  pool.getConnection(function(err,connection){
    var uid = req.params.uid;
    var cid = req.params.cid;
    var sql = 'select user.user_id, enrolled.course_id, material.material_id AS completed_material_id, material.material_name AS completed_material_name, link.url, link.video_tag, post.text, downloadable_file.path, downloadable_file.type, downloadable_file.size from user inner join enrolled on user.user_id = enrolled.user_id inner join material on enrolled.course_id = material.course_id inner join completed_materials on user.user_id = completed_materials.user_id and completed_materials.material_id = material.material_id left join link on material.material_id = link.material_id left join post on material.material_id = post.material_id left join downloadable_file on material.material_id = downloadable_file.material_id where user.user_id = ? and enrolled.course_id = ?';
    if (err) {
      console.log('Database Connetion failed:' + err);
      res.status(400).send(err);
    }  
    connection.query(sql, [uid, cid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } 
    });  
  });
});

app.put('/api/completematerial', function (req,res) {
  var uid = req.body.uid;
  var mid = req.body.mid;
  var sql = 'INSERT INTO COMPLETED_MATERIALS (`user_id`, `material_id`, `date_time`) VALUES (?, ?, NOW());';
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [uid, mid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
  
});

app.get('/api/user/:uid/course/:cid/progress', function (req, res) {
  pool.getConnection(function(err,connection){
    var uid = req.params.uid;
    var cid = req.params.cid;
    var sql = 'select a.completed_count, b.total_count, b.course_id from (select count( 1 ) as completed_count from material inner join completed_materials on completed_materials.material_id = material.material_id where user_id = ? and course_id = ?) a LEFT JOIN (select count( 1 ) as total_count, material.course_id as course_id from material where course_id = ?) b on b.course_id = ?';
    if (err) {
      console.log('Database Connetion failed:' + err);
      res.status(400).send(err);
    }  
    connection.query(sql, [uid, cid, cid, cid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];

        if (rows.length != 0) {
          response.push({'result' : 'success', 'data' : rows});
        } else {
          response.push({'result' : 'error', 'msg' : 'No Results Found'});
        }
        res.status(200).send(JSON.stringify(response));
      } 
    });  
  });
});

app.put('/api/completecourse', function (req,res) {
  var uid = req.body.uid;
  var cid = req.body.cid;
  var sql = "UPDATE `ENROLLED` SET `end_time`=NOW(), `complete`='Yes' WHERE `user_id`=? and`course_id`=?";
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [uid, cid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
  
});

app.put('/api/authenticatefaculty', function (req,res) {
  var uid = req.body.uid;
  var fid = req.body.fid;
  var sql = "UPDATE `FACULTY` SET `grantor_id`=? WHERE `faculty_id`=?";
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [uid, fid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
  
});

app.put('/api/authenticateadmin', function (req,res) {
  var uid = req.body.uid;
  var aid = req.body.aid;
  var sql = "UPDATE `administrator` SET `grantor_id`=? WHERE `admin_id`=?";
 
  pool.getConnection(function(err,connection){
    connection.query(sql, [uid, aid], function(err, rows, fields) {
      connection.release();
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
    });
  });
  
});



// Create server
app.listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});


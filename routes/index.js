var express = require('express');
var router = express.Router();
var request = require("request");
var path = require('path');


/* ----- Connects to SQL database ----- */

var oracledb = require('oracledb')
let connection
async function run(){

  try{
    connection = await oracledb.getConnection({
      user: "louiseli",
      password: "password1234",
      connectString:"cis550.cgpg7aopcofh.us-east-1.rds.amazonaws.com:1521/caltrack"

      })
      console.log('success')

  }catch(err){
    console.error(err)
  }finally{
    if(connection){
      try{
       // await connection.close()
      }catch(err){
        console.error(err)
      }
    }
  }
}
run()

/* ------------------------------------------- */
/* ----- Routers to handle FILE requests ----- */
/* ------------------------------------------- */

/*-------Landing Page-------*/
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'landing.html'));
});

/* ----- User Registration ----- */
router.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'register.html'));
});

/* ----- Log in ----- */
router.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
});



router.get('/edit', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'edit.html'));
});

// /* ----- exercise search page ----- */
router.get('/exerciseSearch',isLoggedin, function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'exerciseSearch.html'));
});

// /* ----- food search page ----- */
router.get('/foodSearch', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'foodSearch.html'));
});

// /* ----- calories search page ----- */
router.get('/caloriesSearch', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'caloriesSearch.html'));
});

// /* ----- protein search page ----- */
router.get('/proteinSearch', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'proteinSearch.html'));
});

// /* ----- History ----- */
router.get('/history', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'history.html'));
});
/* ----- Recommend ----- */
router.get('/rec', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'recommend.html'));
});

/* ----- track ----- */
router.get('/track',function(req,res){
  res.sendFile(path.join(__dirname, '../', 'views', 'track.html'));
})
/* ------------------------------------------------ */
/* ----- Routers to handle data requests ----- */
/* ------------------------------------------------ */

/* ----- Landing ----- */
router.get('/', function(req, res) {
    res.render('landing.html')
});


/* ----- user registration ----- */
router.get('/register', function(req, res) {
    res.render('register.html')
});
//logic
router.post('/register',function(req,res){
  console.log('create a new user!')
  if(!req.body.username){
    res.status(400).json({error: 'missing username or password'})
    return
  }

    var username = req.body.username
        ,password = req.body.password
     connection.execute(
      'INSERT INTO USERS (USERNAME,PASSWORD) VALUES (:USERNAME,:PASSWORD)',
     {
      USERNAME: username,
      PASSWORD: password
     },{ autoCommit: true}
     ,function(err){
      if (err) {
        console.log(err);
        req.flash('error','Signup Failed...')

      }else {
      //req.session.user =
      req.flash('succcess','Welcome,'+username+'Please Log in!')
      res.redirect('/login')
      }
     })

})
router.get('/profile',isLoggedin, function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'profile.html'));
});

router.get('/edit', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'edit.html'));
});

router.put('/edit',function(req,res){
    console.log('老子要来修改你了!')
    var age = req.body.age
    var height = req.body.height
    var weight = req.body.weight
    var gender = req.body.gender
    var aim = req.body.aim
    var bmr = req.body.bmr
    var fav_fd = req.body.fav_fd
    var fav_ex = req.body.fav_ex
    console.log('gender= '+gender)
    console.log('aim= '+aim)
    console.log('fav_fd= '+fav_fd)
    console.log('fav_ex= '+fav_ex)
       connection.execute(
          'UPDATE USERS SET AGE = '+age+', HEIGHT = '+height+', Weight=' +weight+', PHYSIOLOGICAL_GENDER = '+"'"+gender+"'" + ',GOAL = '+"'"+aim+"'"+',BMR = '+ bmr+ ',FAVFOOD = '+"'"+fav_fd+"'"+',FAVEXERCISE = ' + "'"+fav_ex+"'"+' WHERE USER_ID ='+req.session.user[0]
       ,{
       },{ autoCommit: true} 
       ,function(err){
        if (err) console.log(err);
        else {
          console.log("兄弟成功了呀")
        }
       })
  })


router.get('/profile/:id', isLoggedin,function(req, res) {
 // var currentUser_id = req.params.id;
  var currentUser_id = req.session.user[0]
  var query = `SELECT * FROM USERS WHERE USER_ID = ` + currentUser_id
  console.log("query "+ query)
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows.rows[0]);
    }
  });
});

/* ------------------------------------------------ */
/* ----- Routers to handle data requests ----- */
/* ------------------------------------------------ */

// exercise
router.get('/exerciseSearch/:e',function(req, res) {
  var input = req.params.e;
  var query = `select specific_motion from MET where upper(specific_motion) like upper('%`+input+`%')`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });

});

router.get('/exerciseSearch1/:e',function(req, res) {
  var input = req.params.e;
  // var userid = req.session.user[0];
  // console.log(userid);
  var userid = req.session.user[0];
var query = `select 60*3.5*weight*(select METs from MET where specific_motion='`+input+`')/200 from USERS where user_id=`+userid;
 // var query = `select 60*3.5*weight*(select METs from MET where specific_motion='`+input+`')/200 from USERS where username='Eric Smart'`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });

});

/*------------food--------------*/
router.get('/foodSearch/:f', function(req, res) {
  var input = req.params.f;
  var query = `SELECT food_id, name FROM NUTRITION WHERE upper(NAME) LIKE upper('%`+input+`%')`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });

});

router.get('/foodSearch1/:f', function(req, res) {
  var input = req.params.f;
  console.log(input);
  var query = `select fiber,protein from NUTRITION where food_id=`+input;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });

});

//calories
router.get('/caloriesSearch/:n', function(req, res) {
  var input = req.params.n;
  var query = `SELECT name,calories FROM NUTRITION WHERE calories>=`+input+`-10 AND calories<=`+input+`+10 and rownum<=5`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });
});

//protein
router.get('/proteinSearch/:p', function(req, res) {
  var input = req.params.p;
  var query = `SELECT name FROM NUTRITION WHERE protein>=`+input+`-10 AND protein<=`+input+`+10 and rownum<=5`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });
});


// /* ----- History records ----- */
router.get('/history/:d/:dd', function(req, res){
  console.log('HERE history')
  var date1 = req.params.d;
  var date2 = req.params.dd;

  var x = new Date(date1),
      month = '' + (x.getMonth() + 1),
      day = '' + x.getDate(),
      year = x.getFullYear();
  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;
  var formated_date = [year, month, day].join('-');

  var y = new Date(date2),
      month2 = '' + (y.getMonth() + 1),
      day2 = '' + y.getDate(),
      year2 = y.getFullYear();
  if (month2.length < 2)
      month2 = '0' + month2;
  if (day2.length < 2)
      day2 = '0' + day2;
  var formated_dd = [year2, month2, day2].join('-');

  var query =
    `SELECT RECORD_DATE, FOOD_NAME, AMOUNT FROM FOOD_TRACK FT ` +
    `WHERE FT.USER_ID = `+req.session.user[0]+` AND FT.RECORD_DATE >= to_date('` + formated_date + `', 'yyyy-mm-dd')` +
    ` AND FT.RECORD_DATE <= to_date('` + formated_dd + `', 'yyyy-mm-dd')`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });
})
router.get('/history1/:d/:dd', function(req, res){
  console.log('HERE history1')
  var date1 = req.params.d;
  var date2 = req.params.dd;

  var x = new Date(date1),
      month = '' + (x.getMonth() + 1),
      day = '' + x.getDate(),
      year = x.getFullYear();
  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;
  var formated_date = [year, month, day].join('-');

  var y = new Date(date2),
      month2 = '' + (y.getMonth() + 1),
      day2 = '' + y.getDate(),
      year2 = y.getFullYear();
  if (month2.length < 2)
      month2 = '0' + month2;
  if (day2.length < 2)
      day2 = '0' + day2;
  var formated_dd = [year2, month2, day2].join('-');
  var query =
    `SELECT RECORD_DATE, EXERCISE_NAME, TIME FROM EXERCISE_TRACK ET ` +
    `WHERE ET.USER_ID = `+req.session.user[0]+` AND ET.RECORD_DATE >= to_date('` + formated_date + `', 'yyyy-mm-dd')` +
    ` AND ET.RECORD_DATE <= to_date('` + formated_dd + `', 'yyyy-mm-dd')`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });
})
/* ----- Recommend ----- */
router.get('/rec', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'recommend.html'));
});
/* ----- Recommendations ----- */
router.get('/recdata', function(req, res) {

  console.log("recdata!")
  var query =
  `WITH temp AS (SELECT FAVEXERCISE AS t FROM USERS WHERE USER_ID=`+req.session.user[0]+`) ` +
  `SELECT M.SPECIFIC_MOTION FROM MET M, temp ` +
  `WHERE SPECIFIC_MOTION LIKE '%' || temp.t || '%' ` +
  `AND ROWNUM < 6 `;
  /*
  var query =
  `SELECT M.SPECIFIC_MOTION FROM MET M `+
  `WHERE M.ACTIVITY IN ` +
  `(SELECT M.ACTIVITY FROM MET M JOIN LIKE_TO_DO L ON M.EXERCISE_ID = L.EXERCISE_ID WHERE L.USER_ID = `+req.session.user[0]+`)` +
  `AND M.EXERCISE_ID NOT IN ` +
  `(SELECT L.EXERCISE_ID FROM LIKE_TO_DO L WHERE L.USER_ID = `+req.session.user[0]+`) ` +
  `AND ROWNUM <= 5`;*/
  console.log("query "+query)
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });
});

/* ----- login ----- */
//get the username here
router.get('/login',function(req,res){
  res.render('login.html')
})

//how to keep this after loggedin ??
router.post('/login',function(req,res){
  var username = req.body.username
  var pwd = req.body.password
  var query = `select * from USERS where USERNAME=`+"'"+username+"'"
  console.log(query)
  connection.execute(query,function(err,rows,fields){
    if(err){
      console.log("err:",err)
      req.flash('error','Username not found.')
    }
    console.log(rows)
    if(rows.rows.length>0){
      //cast to json object
      var userObject = JSON.parse(JSON.stringify(rows.rows))//user array, 每一个元素也是一个array，是user的信息
      console.log("rows are now:"+typeof(userObject))//object
     req.session.user = userObject[0]
      console.log(req.session.user)
      console.log(typeof(req.session.user))//object c
      console.log(req.session.user[0])//id
    }
    //res.send(req.session.user)
    req.flash('success','Welcome back,'+username)
    res.redirect('/profile')
  })
})

router.get('/test',(req,res)=>{
  if(!req.session.user){
    res.redirect('/login')
  }
  console.log(req.session.user)//can get this
})


/* ----- logout ----- */
router.get('/logout',function(req,res){
  req.session.destroy()//clear the session after logout
 // req.flash('success','Logged you out.')
  res.redirect('/')
})

//------------------------- for track ----------------------------------------------------------------------------------------
router.get('/exercise_track1/:e', function(req, res) {
  var input = req.params.e;
  var query = `select specific_motion from MET where specific_motion like '%`+input+`%'`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(typeof(rows.rows));
      res.json(rows.rows);
    }
  });

});

router.post('/exercise_track',function(req,res){
  console.log('create a new exercise_track track for user!')
  /*
  if(!req.body.exercise_name || !req.body.workout_time){
    res.status(400).json({error: 'missing important information'})
    return
  }
*/
    var userID = req.session.user[0]
    var exercise_name = req.body.exercise_name //req.body.exercise_name,
    var workout_time = req.body.workout_time //req.body.workout_time

  var recordDate = new Date()

        connection.execute(
          'INSERT INTO EXERCISE_TRACK (USER_ID,EXERCISE_NAME,RECORD_DATE,TIME) VALUES (:USER_ID, :EXERCISE_NAME, :RECORD_DATE, :TIME)',
         {
          USER_ID: userID,
          EXERCISE_NAME: exercise_name,
          RECORD_DATE: recordDate,
          TIME: workout_time
         },{ autoCommit: true}
         ,function(err){
          if (err) console.log(err);
          else {
            res.json({
              message:'new track success!'
            });
          }
         })
        })

router.get('/food_track/:f', function(req, res) {
  var input = req.params.f;
  var query = `SELECT food_id, name FROM NUTRITION WHERE NAME LIKE '%`+input+`%'`;
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows.rows);
      res.json(rows.rows);
    }
  });

});


router.post('/food_track',function(req,res){
  console.log('create a new food_track track for user!')
  /*
  if(!req.body.exercise_name || !req.body.workout_time){
    res.status(400).json({error: 'missing important information'})
    return
  }
*/
    var userID = req.session.user[0]
    var food_name = req.body.food_name
    var recordDate = new Date()
    var food_amount = req.body.food_amount

        console.log("我正在运行 new")
        connection.execute(
          'INSERT INTO FOOD_TRACK (USER_ID,FOOD_NAME,RECORD_DATE,AMOUNT) VALUES (:USER_ID, :FOOD_NAME, :RECORD_DATE, :AMOUNT)',
          {
          USER_ID: userID,
          FOOD_NAME: food_name,
          RECORD_DATE: recordDate,
          AMOUNT: food_amount
          },{ autoCommit: true}
          ,function(err){
          if (err) console.log(err);
          else {
            res.json({
              message:'new track success!'
            });
          }
          })
        })

//------------------------- for track ----------------------------------------------------------------------------------------
router.get('/advise', function(req, res) {
  var userId = req.session.user[0]
  var query =
      // 'CREATE INDEX et_id on exercise_track(EXERCISE_NAME);\n'+
      // 'CREATE INDEX ft_id on food_track(FOOD_NAME);\n'+
      'WITH E_TEMP AS (' +
  'SELECT ET.exercise_name, ' +
  'ET.TIME * 3.5 * M.METS * ' +
    '(SELECT U.WEIGHT FROM USERS U WHERE U.USER_ID='+userId+') / 200 AS CALORIES_OUT ' +
  'FROM exercise_track ET JOIN MET M ' +
    'ON ET.EXERCISE_NAME = M.SPECIFIC_MOTION ' +
  'WHERE ET.USER_ID = ' + userId +
'), F_TEMP AS (' +
  'SELECT FT.food_name, ' +
  'FT.AMOUNT / 100 * N.CALORIES AS CALORIES_IN ' +
  'FROM FOOD_TRACK FT JOIN NUTRITION N ' +
  'ON FT.FOOD_NAME = N.NAME ' +
  'WHERE FT.USER_ID = ' + userId +

'), DIFF_TEMP AS (' +
  'SELECT (U.BMR - (SUM(F_TEMP.CALORIES_IN) - SUM(E_TEMP.CALORIES_OUT))) AS DIFF ' +
  'FROM USERS U, E_TEMP, F_TEMP ' +
  'WHERE U.USER_ID = '+userId +
  'GROUP BY BMR) ' +
'SELECT CASE WHEN DIFF > 0 ' +
  'THEN (SELECT * ' +
  'FROM ( SELECT NAME FROM NUTRITION, DIFF_TEMP ' +
    'WHERE CALORIES <= DIFF_TEMP.DIFF ' +
    'ORDER BY dbms_random.value) ' +
  'WHERE ROWNUM < 2 )' +
  'ELSE (SELECT * ' +
  'FROM (SELECT M.SPECIFIC_MOTION FROM MET M, DIFF_TEMP ' +
    'WHERE (60 * 3.5 * M.METS * (SELECT U.WEIGHT FROM USERS U WHERE U.USER_ID='+userId+') / 200) <= -DIFF_TEMP.DIFF ' +
    'ORDER BY dbms_random.value) ' +
  'WHERE ROWNUM < 2 )' +
  'END ' +
'FROM DIFF_TEMP';
  console.log("query"+query);
  connection.execute(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {

        console.log(rows.rows);
        res.json(rows.rows);

    }
  });
});



//check if user is logged in
function isLoggedin(req,res,next){
  if(req.session.user){
    return next()
  }else{
    res.redirect('/login')
  }
}



module.exports = router;

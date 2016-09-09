var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Leader = require('../models/leader');
var mid = require('../middleware');


//for rendering index
var syllabus = require('../public/json/syllabus.json');

var sylList = Object.keys(syllabus).map(function(value) {
							         return syllabus[value]});

var modulesObj = require('../public/json/modulesinfo.json')

var modulesList = Object.keys(modulesObj).map(function(value) {
							         return modulesObj[value]});

router.get('/about_text', function(req, res, next){
	return res.render('about_text');
})

// roll

router.get('/roll', function(req, res, next){
	return res.render('roll');
})


router.get('/adm', mid.requiresAdmin , function(req,res,next){
	console.log(req.query.id == null);
	User.find({}, function(err,users){
		var userMap = {};

		users.forEach(function(user){
			userMap[user.name] = {name: user.name,
								  id: user._id}

		});
		if (req.query.id == null) {
			return res.render('adm',{userMap:userMap, profile:false});
		}else{

	User.getProfile(req.query.id, function (err, result){
	
		if (err){
				return next(err);
			} else {

				

				var completed = result.record.length;
				modules = [];
			        for (var i = 0; i<8; i++){
			          modules[i] = {};
			        }

			        for (var i =0; i<result.record.length;i++ ){
			          modules[result.record[i].moduleNo - 1][result.record[i].label] = true;
			         
			        }	

			       // console.log(result)
				for (var i = 0; i < modules.length; i++){
					var readingCount = 0;
					if (modules[i].reading_1) readingCount++
					if (modules[i].reading_2) readingCount++
					if (modules[i].reading_3) readingCount++
					modules[i].name = "Module " + (i+1);
					modules[i].readingCount = readingCount;
					modules[i].moduleNo = (i+1);
					if (readingCount == 3) modules[i].reading = true;

				}

				completed =  Math.trunc(100*completed/(modules.length * 6))
				// console.log(modules);

				 return res.render('adm',{userMap:userMap, profile:true, title: 'Student Profile', name:result.name, random: result.random, record:modules, completed:completed});
			}
	})
		}

	})

	

})


router.post('/reportTest',mid.requiresAdmin, function(req, res, next){


		User.record(req.body.id, req.body.moduleNo, req.body.label, function(err, passed){
			return res.send(passed);

		})

	
});


//GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next){
	


	User.getProfile(req.session.userId, function (err, result){
	
		if (err){
				return next(err);
			} else {

				

				var completed = result.record.length;
				modules = [];
			        for (var i = 0; i<8; i++){
			          modules[i] = {};
			        }

			        for (var i =0; i<result.record.length;i++ ){
			          modules[result.record[i].moduleNo - 1][result.record[i].label] = true;
			         
			        }	

			       // console.log(modules)
				for (var i = 0; i < modules.length; i++){
					var readingCount = 0;
					if (modules[i].reading_1) readingCount++
					if (modules[i].reading_2) readingCount++
					if (modules[i].reading_3) readingCount++
					modules[i].name = "Module " + (i+1);
					modules[i].readingCount = readingCount;
					modules[i].moduleNo = (i+1);
					if (readingCount == 3) modules[i].reading = true;

				}

				completed =  Math.trunc(100*completed/(modules.length * 6))
				// console.log(modules);

				 return res.render('profile',{ title: 'Student Profile', name:result.name, random: result.random, record:modules, completed:completed});
			}
	})
});

//get /login
router.get('/login', mid.loggedOut, function(req, res,next){
	return res.render('login', {title: 'Log in'});
});

//post /login

router.post('/login', function(req, res, next){
	if (req.body.email && req.body.password){
		User.authenticate(req.body.email, req.body.password, function(error, user){
			if (error || !user){
				var err = new Error('Wrong email or password');
				err.status = 401;
				return next(err);
			} else{
				req.session.userId = user._id;
				return res.redirect('/profile');
			}
		});
	}else {
		var err = new Error('Email and passwords are both required.');
		err.status = 401;
		return next(err);
	}
	

	
});


// logout

router.get('/logout', function(req, res, next){
	if (req.session){
		req.session.destroy(function(err){
			if (err){;
				return next(err);
			} else {
				return res.redirect('/');
			}
		})
	}
});


// GET Syllabus//

router.get('/grading', function(req, res, next){
	res.render('grading',{title: 'Grading and Class Policies'})
});

/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Home' , sylList: sylList, modules: modulesList});
});

// REGISTER POST */

router.post('/register', function(req, res, next){
	if (req.body.email&&
		req.body.name &&
		req.body.random &&
		req.body.password &&
		req.body.confirmPassword){
		//password confirmation
		if (req.body.password !== req.body.confirmPassword){
			var err = new Error('Passwords do not match.')
			err.status = 400;
			return next(err);
		}

		//use schema's create to insert
		var userData ={
			email: req.body.email,
			name: req.body.name,
			random: req.body.random,
			password: req.body.password
		}

		User.create(userData, function(error, user){
			if (error){
				return next(error);
			}else{
				req.session.userId = user._id;
				return res.redirect('/profile')
			}
		});

		
	}else{
		var err = new Error('All fields required!')
		err.status = 400;
		return next(err);
	}
});


/* GET register */

router.get('/register', mid.loggedOut, function(req, res, next){
	return res.render('register', {title: 'Sign up'})
});

// MODULE ROUTES/
// 1//

router.get('/shh1', function(req, res, next){
	return res.render('solution', {title: 'Module One', file: "1"})
});


router.get('/1', function(req, res, next){

	return res.render('modules', {title: 'Module One', file: "1", part:"reading"})
});

router.get('/1/quiz', function(req, res, next){

	return res.render('modules', {title: 'Module One', file: "1", part: "quiz"})
});

router.get('/1/concepts', function(req, res, next){

	return res.render('modules', {title: 'Module One', file: "1", part: "concepts"})
});

router.get('/1/reading', function(req, res, next){

	return res.redirect('/1');
});


// 2//


router.get('/shh2', function(req, res, next){
	return res.render('solution', {title: 'Module Two', file: "2"})
});

router.get('/2', function(req, res, next){
	return res.render('modules', {title: 'Module Two', file: "2", part:"reading"})
});

// router.get('/2', function(req, res, next){
// 	var err = new Error('Module not yet available.');
// 				err.status = 401;
// 				return next(err);

// });

router.get('/2/wason', function(req, res, next){

	return res.render('wason');
});




router.get('/2/quiz', function(req, res, next){

	return res.render('modules', {title: 'Module One', file: "2", part: "quiz"})
});

router.get('/2/concepts', function(req, res, next){

	return res.render('modules', {title: 'Module One', file: "2", part: "concepts"})
});

router.get('/2/reading', function(req, res, next){

	return res.redirect('/2');
});


// 3


router.get('/shh3', function(req, res, next){
		return res.render('solution', {title: 'Module Three', file: "3"})
});

router.get('/3', function(req, res, next){
	var err = new Error('Module not yet available.');
				err.status = 401;
				return next(err);
});


// router.get('/shh4', function(req, res, next){
// 		return res.render('solution', {title: 'Module Three', file: "3"})
// });

router.get('/4', function(req, res, next){
	var err = new Error('Module not yet available.');
				err.status = 401;
				return next(err);
});

router.get('/5', function(req, res, next){
	var err = new Error('Module not yet available.');
				err.status = 401;
				return next(err);
});

router.get('/6', function(req, res, next){
	var err = new Error('Module not yet available.');
				err.status = 401;
				return next(err);
});


router.get('/7', function(req, res, next){
	var err = new Error('Module not yet available.');
				err.status = 401;
				return next(err);
});

router.get('/8', function(req, res, next){
	var err = new Error('Module not yet available.');
				err.status = 401;
				return next(err);
});


//100

router.get('/debug', function(req, res, next){
	return res.render('modules', {title: 'Module Debug', file: "debug"})
});



// grading reporting

router.post('/report', function(req, res, next){


	if (!req.session || ! req.session.userId){
		return res.send("Since you were not signed in, no record was made. Sadly, the world will never know about your logical prowess.")
	} else {
		User.record(req.session.userId, req.body.moduleNo, req.body.label, function(err, passed){
			return res.send(passed);

		})

	}
});


router.post('/wason', function(req, res, next){


	if (req.session.userId){
		User.getName(req.session.userId, function (err, name){
			
			Leader.update(name, "wason", req.body.score, function(err, response){
				return res.send(response);
				})
			})
	}else{
		return res.send(response);}
});



router.post('/ranking', function(req, res, next){

	Leader.getRanking(req.body.game, function (err, response) {
		// console.log(response);
		return res.send(response);
	})
});


module.exports = router;





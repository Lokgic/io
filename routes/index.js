var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware');

//for rendering index
var syllabus = require('../public/json/syllabus.json');

var sylList = Object.keys(syllabus).map(function(value) {
							         return syllabus[value]});

var modulesObj = require('../public/json/modules.json')

var modulesList = Object.keys(modulesObj).map(function(value) {
							         return modulesObj[value]});

//GET /profile

router.get('/profile', mid.requiresLogin, function(req, res, next){
	
	User.findById(req.session.userId)
		.exec(function (error, user){
			if (error){
				return next(error);
			} else {
				return res.render('profile',{ title: 'Student Profile', name: user.name, random: user.random});
			}
		});
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

router.get('/1', function(req, res, next){
	return res.render('modules', {title: 'Module One', file: "1"})
});



router.post('/report', function(req, res, next){
	

	if (!req.session || ! req.session.userId){
		return res.send([3, "Nice, but since you were not signed in, no record was made. Sadly, the world will never know about your logical prowess."])
	} else {
		User.checkQuizRecord(req.body.quiz, req.session.userId, function (err, passed){
			if (err){
				console.log(err);
				return next(err);
			}else {
				if (passed){
					return res.send([2, "No change was made to your record since you had already completed this task, but hey - you still got it!"]);
				}else if(req.body.passed){	
					var quizId = ""+req.body.quiz;
					var timeString =quizId + "time";
					var query ={};
					query[quizId] = true;
					query[timeString] = Date.now();
					User.findOneAndUpdate({"_id": req.session.userId},query, function(error, user){
						if (error){
							return next(error);
						}else{
							return res.send([1,"Congratulations! You have completed this task and your record has been updated."]);
							}
						});
				}
			}
		})
	}
});


// router.post('/1q', function(req, res, next){
// 	if (!req.session || ! req.session.userId){
// 		return res.send("Your score was not recorded because you were not signed in.")
// 	} else {

// 		User.findOneAndUpdate({"_id": req.session.userId},{"quiz1": true, "quiz1time": Date.now()}, function(error, user){

// 			if (error){
// 				return next(error);
// 			}else{
				
// 				return res.send("Record Updated.");
// 			}
			
// 		});
// 	}
// });


// router.post('/1r', function(req, res, next){
// 	console.log(req.originalUrl);
// 	if (!req.session || ! req.session.userId){
// 		return res.send("You are not signed in.");
// 	} else {
		
// 		User.checkQuizRecord("reading1",req.session.userId, function (err, passed){
// 			if (passed){
// 				return res.send(" Quiz passed previously.");
// 			}else if(req.body.passed){	
// 				User.findOneAndUpdate({"_id": req.session.userId},{"reading1": true, "reading1time": Date.now()}, function(error, user){
// 					if (error){
// 						return next(error);
// 					}else{
// 						return res.send("Record Updated.");
// 						}
// 					});
// 			}
// 		})
// 	}
// });

// Requesting info from DB
//Get quiz



		
		


module.exports = router;





var express = require('express');
var router = express.Router();
var User = require('../models/user');
var TestingData = require('../models/data');
var Leader = require('../models/leader');
var mid = require('../middleware');
// var mysql  = require('mysql');

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

router.get('/syl', function(req, res, next){
	return res.render('syl');
})


// roll

router.get('/roll', function(req, res, next){
	return res.render('roll');
})



router.post('/stat' , function(req,res,next){

		var roster = ["zalbert9@gmail.com","spencer.flynn49@gmail.com","vl25@duke.edu","jpp20@duke.edu","dyk@duke.edu","rk189@duke.edu","oneroyalace@gmail.com","lz114@duke.edu","haley.fisher@duke.edu", "aha19@duke.edu","bkc19@duke.edu","mts28@duke.edu","ec161@duke.edu","bac29@duke.edu"];
		User.find({}, function(err, users){
			var scores =[];
			users.forEach(function(user){
				if (roster.indexOf(user.email)!= -1){
						scores.push(user.record.length);
				}
			})
			return res.send(scores);
		})
})

router.get('/stat' , function(req,res,next){


			return res.render('stat');

})



router.get('/adm', mid.requiresAdmin , function(req,res,next){


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




//GET /progress
router.post('/progress', mid.requiresLogin, function(req, res, next){



	User.getProfile(req.session.userId, function (err, result){

		if (err){
				return next(err);

				return res.send(result);
			} else {return res.send(result.record);
			//
			//
			//
			// 	var completed = result.record.length;
			// 	modules = [];
			//         for (var i = 0; i<8; i++){
			//           modules[i] = {};
			//         }
			//
			//         for (var i =0; i<result.record.length;i++ ){
			//           modules[result.record[i].moduleNo - 1][result.record[i].label] = true;
			//
			//         }
			//
			//        // console.log(modules)
			// 	for (var i = 0; i < modules.length; i++){
			// 		var readingCount = 0;
			// 		if (modules[i].reading_1) readingCount++
			// 		if (modules[i].reading_2) readingCount++
			// 		if (modules[i].reading_3) readingCount++
			// 		modules[i].name = "Module " + (i+1);
			// 		modules[i].readingCount = readingCount;
			// 		modules[i].moduleNo = (i+1);
			// 		if (readingCount == 3) modules[i].reading = true;
			//
			// 	}
			//
			// 	completed =  Math.trunc(100*completed/(modules.length * 6))
			// 	// console.log(modules);
			// 					// console.log(completed);
			// 	var box;
			// 	if (result.box == undefined) box = false;
			// 		else box = result.box;
			// 	 return res.render('profile',{box:box, title: 'Student Profile', name:result.name, random: result.random, record:modules, completed:completed});
			}
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
								// console.log(completed);
				var box;
				if (result.box == undefined) box = false;
					else box = result.box;
				 return res.render('profile',{box:box, title: 'Student Profile', name:result.name, random: result.random, record:modules, completed:completed});
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
	var introText = require('../public/json/intro.json')
  res.render('intro',{text:introText});
});


router.get('/present',  function(req, res, next) {
  res.redirect('/presentation/index.html');
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

router.get('/shh1',  mid.requiresAdmin,function(req, res, next){
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


router.get('/shh2', mid.requiresAdmin, function(req, res, next){
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

	return res.render('wason', {wa_n:""});
});




router.get('/2/quiz', function(req, res, next){

	return res.render('modules', {title: 'Module Two', file: "2", part: "quiz"})
});

router.get('/2/concepts', function(req, res, next){

	return res.render('modules', {title: 'Module Two', file: "2", part: "concepts"})
});

router.get('/2/reading', function(req, res, next){

	return res.redirect('/2');
});


// 3


router.get('/shh3', mid.requiresAdmin, function(req, res, next){
		return res.render('solution', {title: 'Module Three', file: "3"})
});

router.get('/3', function(req, res, next){
	return res.render('modules', {title: 'Module Three', file: "3", part:"reading"});
});
router.get('/3/concepts', function(req, res, next){

	return res.render('modules', {title: 'Module Three', file: "3", part: "concepts"})
});

router.get('/3/reading', function(req, res, next){

	return res.redirect('/3');
});

router.get('/3/quiz', function(req, res, next){
	return res.render('modules', {title: 'Module Three', file: "3", part: "quiz"})
});

router.get('/3/logicland', function(req,res,next){
	return res.render('scoring', {title: "logicland"})
});

router.get('/shh4',mid.requiresAdmin, function(req, res, next){
		return res.render('solution', {title: 'Module Four', file: "4"})
});

router.get('/4', function(req, res, next){
return res.render('modules', {title: 'Module Four', file: "4", part: "reading"})
});

router.get('/4/reading', function(req, res, next){

	return res.redirect('/4');
});


router.get('/4/concepts', function(req, res, next){

	return res.render('modules', {title: 'Module Four', file: "4", part: "concepts"})
});

router.get('/4/quiz', function(req, res, next){
	return res.render('modules', {title: 'Module Four', file: "4", part: "quiz"})
});

router.get('/4/wason2', function(req, res, next){

	return res.render('wason', {wa_n:"2"});
});


router.get('/5', function(req, res, next){
return res.render('modules', {title: 'Module Five', file: "5", part: "reading"})
});

router.get('/5/reading', function(req, res, next){

	return res.redirect('/5');
});

router.get('/5/concepts', function(req, res, next){

	return res.render('modules', {title: 'Module Five', file: "5", part: "concepts"})
});


router.get('/5/logicland2', function(req,res,next){
	return res.render('scoring', {title: "logicland2"})
});

router.get('/5/quiz', function(req, res, next){
	return res.render('modules', {title: 'Module Five', file: "5", part: "quiz"})
});

// router.get('/6', function(req, res, next){
// 	var err = new Error('Module not yet available.');
// 				err.status = 401;
// 				return next(err);
// });

router.get('/6/', function(req, res, next){

	return res.redirect('/6/1');
});

router.get('/6/wason3', function(req, res, next){

	return res.render('wason', {wa_n:"3"});
});

router.get(t = '/6/*', function(req, res, next){
	var moduleNum = req.path.split('/')[1]
	var sectionNum = req.path.split('/')[2]

	var lesson = require('../public/json/lesson6.json');

	return res.render('lesson', {title:"Module Six", content:lesson, sectionNum: "section" + sectionNum, moduleNum:moduleNum});
});

router.get('/7/', function(req, res, next){

	return res.redirect('/7/1');
});



router.get('/7/quiz', function(req,res,next){
		return res.render('grid',{title:"Module Seven", moduleNum:7});

})

router.get(t = '/7/*', function(req, res, next){
	var moduleNum = req.path.split('/')[1]
	var sectionNum = req.path.split('/')[2]

	var lesson = require('../public/json/lesson7.json');

	return res.render('lesson', {title:"Module Seven", content:lesson, sectionNum: "section" + sectionNum, moduleNum:moduleNum});
});

router.get('/grid', function(req,res,next){
		return res.render('grid');

})



router.get('/8/', function(req, res, next){

	return res.redirect('/8/1');
});
router.get(t = '/8/*', function(req, res, next){
	var moduleNum = req.path.split('/')[1]
	var sectionNum = req.path.split('/')[2]
	var lesson = require('../public/json/lesson8.json');

	return res.render('lesson', {title:"Module Eight", content:lesson, sectionNum: sectionNum, moduleNum:moduleNum});
});





router.get(t = '/test', function(req, res, next){
	// var moduleNum = req.path.split('/')[1]
	// var sectionNum = req.path.split('/')[2]
	var lesson = require('../public/json/lesson1.json');

	return res.render('page', {title:"Module One", content:lesson, sectionNum: 1, moduleNum:1});
});




router.get('/logistics', function(req, res, next){
	var syllabus = require('../public/json/logistics.json');
	return res.render('logistics',{syllabus:syllabus});
})





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


router.post('/data', function(req, res, next){

// console.log(req.body)
	if (req.session &&  req.session.userId) {

		User.getName(req.session.userId, function (err, name){
			datapoint = req.body.datapoint;
			datapoint.uid = name;
// console.log(datapoint)
			TestingData.update(req.body.moduleNo, req.body.label, datapoint, function(err, passed){
				console.log(err)
				return res.send(passed);
			})
			})




	}
});

router.post('/wason', function(req, res, next){


	if (req.session.userId){

	}else{
		return res.send(response);}
});

router.post('/wason2', function(req, res, next){


	if (req.session.userId){
		User.getName(req.session.userId, function (err, name){

			Leader.update(name, "wason2", req.body.score, function(err, response){
				return res.send(response);
				})
			})
	}else{
		return res.send(response);}
});

router.post('/wason3', function(req, res, next){


	if (req.session.userId){
		User.getName(req.session.userId, function (err, name){

			Leader.update(name, "wason3", req.body.score, function(err, response){
				return res.send(response);
				})
			})
	}else{
		return res.send(response);}
});

router.post('/logicland', function(req, res, next){


	if (req.session.userId){
		User.getName(req.session.userId, function (err, name){

			Leader.update(name, "logicland", req.body.score, function(err, response){
				return res.send(response);
				})
			})
	}else{
		return res.send(response);}
});

router.post('/logicland2', function(req, res, next){


	if (req.session.userId){
		User.getName(req.session.userId, function (err, name){

			Leader.update(name, "logicland2", req.body.score, function(err, response){
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


router.post('/processing/grid', function(req,res,next){

	grid = require("../js/grid_back.js")
	var model  = new grid.Model()

	var statements = grid.generateStatements(4,model)
// console.log(statements)
	var modelMin = model.grid

	problem = {
		model:modelMin,
		statements: statements
	}


	return res.send(problem)

})


router.post('/processing/model_id', function(req,res,next){

	model_id = require("../js/model_id_gen.js")
	var model  = new model_id.initModel(req.body.diff)
	var statements = model_id.makeProblemSet(model,4)
// console.log(statements)
	problem = {
		model:model,
		statements: statements
	}


	return res.send(problem)

})


router.post('/processing/*', function(req,res,next){

	var generatorID = req.path.split('/')[2]
	var option = req.path.split('/')[3]
	// console.log(option)
	var output;
	var generator = require("../js/"+generatorID+"_gen.js")
	if (option == undefined){
		 output  = new generator.makeStuff()
	} else{
		output  =  generator[option]()
		// if (option == "cats") console.log(output)
	}

// console.log(output)


	return res.send(output)

})

router.get('/logicize/*', function(req,res,next){

	var logicize = req.path.split('/')[2]
	var info = require('../public/json/logicizes.json');


	return res.render('logicizeFS', {title:"Venn Diagram: Syllogism", logicize:logicize, info:info[logicize]});

})
module.exports = router;

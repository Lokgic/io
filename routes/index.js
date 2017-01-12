var express = require('express');
var router = express.Router();
var User = require('../models/user');

var mid = require('../middleware');


//for rendering index





router.get('/syl', function(req, res, next){
	return res.render('syl');
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


/* GET home page. */
router.get('/',  function(req, res, next) {
	var introText = require('../public/json/intro.json')
  res.render('intro',{text:introText});
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

	return res.render('modules', {title: 'Module One', file: "1", part:"reading"})
});



// 2//



router.get(t = '/7/*', function(req, res, next){
	var moduleNum = req.path.split('/')[1]
	var sectionNum = req.path.split('/')[2]

	var lesson = require('../public/json/lesson7.json');

	return res.render('lesson', {title:"Module Seven", content:lesson, sectionNum: "section" + sectionNum, moduleNum:moduleNum});
});




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


router.get(t = '/module/*/*', function(req, res, next){
	var moduleID = req.path.split('/')[2]
	var sectionNum = req.path.split('/')[3]

	var lesson = require('../public/json/'+moduleID + sectionNum +'.json');
	if (moduleID == "SL"){
		var title  = "Sentence Logic";
		var moduleNum = 1;
	}

	return res.render('page', {title:title, content:lesson, sectionNum: sectionNum, moduleNum:moduleNum});
});



router.get('/logistics', function(req, res, next){
	var syllabus = require('../public/json/logistics.json');
	return res.render('logistics',{syllabus:syllabus});
})





//100


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

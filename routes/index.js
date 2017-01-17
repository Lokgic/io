var express = require('express');
var router = express.Router();
var User = require('../models/user');
var data = require('../models/data')
var mid = require('../middleware');
var student = require('../models/student')
var problem = require('../models/problem')
//for rendering index


// student.authenticate("m1","abc",function(error, user){
// 	if (error) console.log(error+ " err!")
// 	else console.log(user)
// })

/* GET register */

router.get('/register', mid.loggedOut, function(req, res, next){
	return res.render('register', {title: 'Sign up'})
});



// REGISTER POST */

router.post('/register', function(req, res, next){

	if (req.body.email&&
		req.body.name &&
		req.body.nickname &&
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
			nickname: req.body.nickname,
			password: req.body.password
		}

		student.create(userData, function(error, user){
			if (error){
				return next(error);
			}else{
				// console.log(user)
				req.session.userId = user.uid;
				req.session.nickname = user.nickname
				return res.redirect('/')
			}
		});


	}else{
		var err = new Error('All fields required!')
		err.status = 400;
		return next(err);
	}
});



// Login stuff
router.post('/login', function(req, res, next){

	if (req.body.email && req.body.password){

		student.authenticate(req.body.email, req.body.password, function(error, user){

			if (error || !user){
				var err = new Error('Wrong email or password');
				err.status = 401;
				return next(err);
			} else{
				// console.log(req.session)

				req.session.userId = user.uid;
				req.session.nickname = user.nickname;

				return res.redirect('/logistics')
			}
		});
	}else {
		var err = new Error('Email and passwords are both required.');
		err.status = 401;
		return next(err);
	}
});


router.get('/login', mid.loggedOut, function(req, res,next){
	return res.render('login', {title: 'Log in'});
});


//log out!

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
	console.log(req.session)
});


/* GET home page. */
router.get('/',  function(req, res, next) {
	var introText = require('../public/json/intro.json')
  res.render('intro',{text:introText});
});



// REGISTER POST */


router.get(t = '/m/*/*', function(req, res, next){
	var moduleID = req.path.split('/')[2]
	var sectionNum = req.path.split('/')[3]

	var lesson = require('../public/json/'+moduleID + sectionNum +'.json');
	if (moduleID == "sl"){
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

router.post('/data/*', function(req,res,next){
	var mode = req.path.split('/')[2]
	console.log(req.body)
	data[mode](req.body,function(error, response){
		if (error) console.log(error)
		else {
			console.log(response)
			res.sendStatus(200)
		}
	})

})
//get problems
router.post('/problem/*', function(req,res,next){

	var mod = req.path.split('/')[2]
	var ch = req.path.split('/')[3]
	var section = req.path.split('/')[4]
	// console.log(mod + ch + section)
	problem.get(mod,ch,section,function(re){
		// console.log(re)
		return res.send(re)
	})


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

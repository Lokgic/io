var express = require('express');
var router = express.Router();
var data = require('../models/data')
var mid = require('../middleware');
var student = require('../models/student')
var problem = require('../models/problem')
//for rendering index


// router.get('/testing', mid.loggedOut, function(req, res, next){
// 	var test = require('../bayes/test.js')
// 	test.test()
// 	return res.render('register', {title: 'Sign up'})
// });


/* GET register */

router.get('/register', mid.loggedOut, function(req, res, next){

	return res.render('register', {title: 'Sign up'})
});

router.get('/profile', function(req, res, next){
	return res.render('profile')
});

router.get('/adm', mid.requiresAdmin, function(req, res, next){
	return res.render('adm')
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

});


/* GET home page. */
router.get('/',  function(req, res, next) {
	var introText = require('../public/json/intro.json')
  res.render('intro',{text:introText});
});



// REGISTER POST */


router.get(t = '/m/*/*', function(req, res, next){
	var moduleID = req.path.split('/')[2]
	var chapterNum = req.path.split('/')[3]

	var lesson = require('../public/json/'+moduleID  +'.json');
	if (moduleID == "sl"){
		var title  = "Sentence Logic";
		var moduleNum = 1;
	} else if (moduleID == "pl"){
		var title  = "Predicate Logic";
		var moduleNum = 2;
	}
	var fileName = moduleID+chapterNum

	if (fileName == "sl1") return res.render('pagesl1', {fileName:fileName,title:title, content:lesson, chapterNum: chapterNum, moduleNum:moduleNum});
	else return res.render('page', {fileName:fileName,title:title, content:lesson, chapterNum: chapterNum, moduleNum:moduleNum});

});



router.get('/logistics', function(req, res, next){
	var syllabus = require('../public/json/logistics.json');
	return res.render('logistics',{syllabus:syllabus});
})



router.get('/explo/*', function(req, res, next){
	var exploId = req.path.split('/')[2]
	return res.render('explo',{fileName:exploId, title:"Epistemic Exploration"});
})



//100
//get profile


router.post('/getExp/*', function(req,res,next){
	var uid = req.path.split('/')[2]
	data.getExp(uid,function(d){

		return res.send(d)
	})
})



router.post('/getBasic/*', function(req,res,next){
	var uid = req.path.split('/')[2]
	data.getBasic(uid,function(d){

		return res.send(d)
	})
})


router.post('/profile/*', function(req,res,next){
	function purge(children){


		for (o in children){

				children[o].completed = false;


				children[o].time = null;

			if (children[o].children != null) purge(children[o].children)
		}
	}



	var sl = require("../public/json/slTree.json")
	purge(sl.children)
	sl.completed = false
	var pl = require("../public/json/plTree.json")
	purge(pl.children)
	pl.completed = false
	var nd = require("../public/json/ndTree.json")
	purge(nd.children)
	nd.completed = false
	var id = require("../public/json/idTree.json")
	purge(id.children)
	id.completed = false
	var pa = require("../public/json/paTree.json")
	purge(pa.children)
	pa.completed = false
	var uid = req.path.split('/')[2]

	var tree = {
		"name":"Logic",
		"type":"root",
		"children":[
			sl,
			pl,
			nd,
			id,
			pa
		]

	}


	data.getProfile(uid,function(response){
		var re = response

		var treeSearch = require('../js/treeSearch.js')

		var index = {
			sl:0,
			pl:1,
			nd:2,
			id:3,
			pa:4
		}

		for (module in re){
			if (re[module].length != 0){
				for (record in re[module]){
					var id = re[module][record].module + "-" + re[module][record].chapter + "-" +re[module][record].section;
				var target = treeSearch.search(tree.children[index[re[module][record].module]],"id",id)

				if (target != null) {
					target.completed = true;
					target.time = re[module][record].createdAt;
				}

				}
			}

			treeSearch.checkChildren(tree.children[0])

		}


		tree.tasksList = treeSearch.searchTask(tree)

		return res.send(tree)
	})


})

router.post('/checkPassed/*',function(req,res,next){

	var mod = req.path.split('/')[2]
	var ch = req.path.split('/')[3]
	var section = req.path.split('/')[4]
	var qu = {
		uid:req.session.userId,
		module:mod,
		chapter:ch,
		section:section

	}

	data.checkPassed(qu,function(d){
		res.send(d[0].count != 0)

	})
})

// grading reporting

router.post('/data/*', function(req,res,next){
	var mode = req.path.split('/')[2]

	data[mode](req.body,function(error, response){
		if (error) {
			var message
			if (error.code == 23505){

					message="Quiz already completed!"
				}else{
					message = "DB error"
				}


			res.send({message:message})
		}
		else {
			console.log(response)
			var resp ={
				message:response
			}
			res.send(resp)
		}
	})

})

router.post('/statData/*', function(req,res,next){
	var database = req.path.split('/')[2]

	data.statData(req.body,database,function(error, response){
		if (error) {
			var message
			if (error.code == 23505){

					message="Quiz already completed!"
				}else{
					message = "DB error"
				}


			res.send({message:message})
		}
		else {
			console.log(response)
			var resp ={
				message:response
			}
			res.send(resp)
		}
	})

})
//get problems
router.post('/problem/*', function(req,res,next){

	var mod = req.path.split('/')[2]
	var ch = req.path.split('/')[3]
	var section = req.path.split('/')[4]

	problem.get(mod,ch,section,function(re){
		// console.log(re)
		return res.send(re)
	})


})


router.post('/getTrees',function(req,res,next){
	var data = require('../db/problem/tree.json')

	return res.send(data["3"].problems[0])
})

router.post('/processing/*', function(req,res,next){

	var generatorID = req.path.split('/')[2]
	var option = req.path.split('/')[3]
	var va = req.path.split('/')[4]


	var output;
	var generator = require("../js/"+generatorID+"_gen.js")

	if (option == undefined){
		 output  = new generator.makeStuff()
	} else if (va == undefined){

		output  =  generator[option]()

	} else{

		output  =  generator[option](va)
	}




	return res.send(output)

})

router.post('/leaderboard/*',function(req,res,next){
	var logicise = req.path.split('/')[2]
	data.getRanking(logicise,function(d){

		res.send(d)
	})
})


router.get('/logicise/*', function(req,res,next){



		var logiciseID = req.path.split('/')[2]
		var info = require('../public/json/logicises.json');

		if (!info[logiciseID]) {
			var err = new Error('No such logicise exists!')
			err.status = 400;
			return next(err);
		}
		if (logiciseID == "vennSyl") return res.render('logicizeFS', { title:"Venn Diagram: Syllogism", logicise:logiciseID, info:info[logiciseID]});
		else {
			if (req.session.userId){
				data.getExp(req.session.userId,function(expdata){
					return res.render('logicise', { title:info[logiciseID].title, logiciseID:logiciseID, info:info[logiciseID],expdata:expdata});

				})
			}else{
				return res.render('logicise', { title:info[logiciseID].title, logiciseID:logiciseID, info:info[logiciseID]});
			}

		}


})



module.exports = router;

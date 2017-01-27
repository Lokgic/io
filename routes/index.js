var express = require('express');
var router = express.Router();
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

router.get('/profile', function(req, res, next){
	return res.render('profile')
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
	// console.log(req.session)
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
	}
	var fileName = moduleID+chapterNum
	// console.log(fileName)
	if (fileName == "sl1") return res.render('pagesl1', {fileName:fileName,title:title, content:lesson, chapterNum: chapterNum, moduleNum:moduleNum});
	else return res.render('page', {fileName:fileName,title:title, content:lesson, chapterNum: chapterNum, moduleNum:moduleNum});

});



router.get('/logistics', function(req, res, next){
	var syllabus = require('../public/json/logistics.json');
	return res.render('logistics',{syllabus:syllabus});
})





//100
//get profile
router.post('/profile/*', function(req,res,next){
	function purge(children){
		// console.log(children)
		for (o in children){
			if (children[o].completed) {
				children[o].completed = false;
				children[o].time = null;
			}
			if (children[o].children != null) purge(children[o].children)
		}
	}



	var sl = require("../public/json/slTree.json")
	purge(sl.children)
	var pl = require("../public/json/plTree.json")
	purge(pl.children)
	var nd = require("../public/json/ndTree.json")
	purge(nd.children)
	var id = require("../public/json/idTree.json")
	purge(id.children)
	var pa = require("../public/json/paTree.json")
	purge(pa.children)
	var uid = req.path.split('/')[2]
	console.log(sl.children[0].children[0].children[0])
	// console.log(uid)
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

	// console.log(tree)
	// console.log(mod + ch + section)
	data.getProfile(uid,function(response){
		var re = response
		// console.log("re = ")
		// console.log(re)
		var treeSearch = require('../js/treeSearch.js')
		// var _ = require('underscore.js')
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
				}else{
					target.time = null;
						target.completed = false;
				}

				// console.log(target)
				}
			}
			// console.log(tree)
			treeSearch.checkChildren(tree.children[0])
			// console.log(tree.children[0])
		}
		// console.log(treeSearch(tree.children[0],'id','sl-1-1'))
		// tree.children[0].children[0].completed = true;
		// tree.children[0].completed = true;

		tree.tasksList = treeSearch.searchTask(tree)
		// console.log(tree.taskList)
		// console.log(tree.children[0].children[0].children[0].children[0])
		return res.send(tree)
	})


})

// grading reporting

router.post('/data/*', function(req,res,next){
	var mode = req.path.split('/')[2]
	// console.log(req.body)
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
	var va = req.path.split('/')[4]
	// console.log(option)
	var output;
	var generator = require("../js/"+generatorID+"_gen.js")
	// console.log(generatorID)
	if (option == undefined){
		 output  = new generator.makeStuff()
	} else if (va == undefined){

		output  =  generator[option]()

		// if (option == "cats") console.log(output)
	} else{
		output  =  generator[option](va)
	}

// console.log(output)


	return res.send(output)

})

router.post('/leaderboard/*',function(req,res,next){
	var logicise = req.path.split('/')[2]
	data.getRanking(logicise,function(d){
		console.log(d)
		res.send(d)
	})
})


router.get('/logicise/*', function(req,res,next){



		var logiciseID = req.path.split('/')[2]
		var info = require('../public/json/logicises.json');
		// console.log(logiciseID)
		if (!info[logiciseID]) {
			var err = new Error('No such logicise exists!')
			err.status = 400;
			return next(err);
		}
		if (logiciseID == "vennSyl") return res.render('logicizeFS', { title:"Venn Diagram: Syllogism", logicise:logiciseID, info:info[logiciseID]});
		else return res.render('logicise', { title:info[logiciseID].title, logiciseID:logiciseID, info:info[logiciseID]});




})



module.exports = router;

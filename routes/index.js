var express = require('express');
var router = express.Router();
var User = require('../models/user');

var mid = require('../middleware');
// var Student = require('../models/student')

//for rendering index




router.get('/syl', function(req, res, next){
	return res.render('syl');
})








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

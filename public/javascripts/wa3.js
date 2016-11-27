var alert = require('./mods/alert.js')
var randomize = require('./mods/randomize.js')
var leaderboard = require('./mods/leaderboard.js')
var mathjax = require('./mods/mathjax.js')
var Chance = require('chance')
var chance = new Chance();
var vowels = ['a','e','i','o','u'];
var consonants = ['b', 'h' ,'p', 'z', 'g'];
var number = [2,3,4,5,6,7,8,9]
var all = 'aeiou' + 'bhpzg' + 23456789
var id = "wason3"
var face = ["even", "odd","consonant", "vowel"];
var color = ["danger", "info"]

mathjax.load();

var CardObj = function(face, color){

	if(face == undefined){
		face = chance.string({length: 1, pool: all});
	} else if (face == "even"){
			face = chance.string({length: 1, pool: "2468"});
	} else if (face == "odd"){
			face = chance.string({length: 1, pool: "3579"});
	} else if (face == "vowel"){
			face = chance.string({length: 1, pool: "aeiou"});
	} else if (face == "consonant"){
			face = chance.string({length: 1, pool: "bhpzg"});
	}
	this.face = face;
	this.vowel = false;
	this.consonant = false;
	this.even = false;
	this.odd = false;
	if (color == undefined){
		if (chance.bool()){
			this.color = "danger"
		} else{
			this.color ="info"
	}}else {
		this.color = color;
	}

	if (isNaN(parseInt(face))){
		this.type = 'letter';
		if (vowels.indexOf(face)!=-1){
			this.vowel = true;

		} else {
			this.consonant = true;

		}
	} else {
		this.type = 'number';
		if (face%2 == 0){

			this.even = true;
		}else{

			this.odd = true;
		}
	}
	this.html =	'<button type = "button" class="btn wason text-xs-center btn-' + this.color + '" value = ' + this.face + ' disabled><h1 class = "display-1">' + this.face + '</h1></button>';
}

var Universe = function(n){
	var weights = {
		odd: 0,
		even: 0,
		vowel: 0,
		consonant: 0,
	}
	// var oddWeight = 0;
	// var evenWeight = 0;
	// var vowelWeight = 0;
	// var consonantWeight = 0;
	// var infoRate = 0;
	// var dangerRate = 0;
	var count = 100;
	for (w in weights){
		if (count != 0){
			weights[w] = chance.integer({min: 0, max: count});
			count = count - weights[w]
		}
	}


		weights.danger = chance.integer({min: 0, max: 100}),
		weights.info = 100 - weights.danger
	console.log(weights)

	this.domain = {};
	while (n>0){

			var temp = new CardObj(

				chance.weighted(['odd','even','vowel', 'consonant'], [weights.odd, weights.even,weights.vowel, weights.consonant]),

			chance.weighted(['info', 'danger'],[weights.info, weights.danger])

		);

				this.domain[n] = temp;
				n--;

	}
}

Universe.prototype.contains = function(obj){
	for (object in this.domain){
		if (this.domain[object].face == obj.face){
			return true;
		}
	}
	return false;
}

var Predicate = function(name){
	this.name = name;
	if (name == "even" || name == "odd"){
		this.type = 'number';
	} else if (name == "info" || name =="danger"){
		this.type = 'color';
	} else {
		this.type = 'letter'
	}
}

Predicate.prototype.truthFunction = function(obj){
	return obj[this.name];
}

Predicate.prototype.negation = function(obj){
	 if (obj.type != this.type) return false
	 else if (obj[this.name]) return false;
	 else return true;
}

Predicate.prototype.toString = function (){

	var prefix = "";

		if (this.name == "even") return prefix + "an even number";
		else if (this.name == "odd") return prefix + "an odd number";
		else if (this.name == "vowel") return prefix + "a vowel letter";
		else if (this.name == "consonant") return prefix + "a consonant letter";

}

function buildExtension(u){
		output = {
			u: [],
			danger: [],
			info: [],
			even:[],
			odd:[],
			vowel:[],
			consonant:[]
		};
		for (object in u ){
			// console.log(object)
			output.u.push(u[object].face)
			output[u[object].color].push(u[object].face)
			if (u[object].even) output.even.push(u[object].face);
			else if (u[object].odd) output.odd.push(u[object].face)
			else if (u[object].vowel) output["vowel"].push(u[object].face)
			else if (u[object].consonant) output.consonant.push(u[object].face)
		}
		return output;
}

var Rule = function(){
	this.quantifier  = randomize.drawOneRandomFromSet(["some","all","notall","none"]);
	// this.quantifier  = randomize.drawOneRandomFromSet(["all"]);
	var f = randomize.drawOneRandomFromSet(face)


	var draw = randomize.shuffle(["left", "right"]);


			this[draw.pop()] = new Predicate(f);

			this[draw.pop()] = new Predicate(randomize.drawOneRandomFromSet(["danger", "info"]));



	this.connective  = randomize.drawOneRandomFromSet(["and","or","implies"])
// this.connective  = randomize.drawOneRandomFromSet(["or"])


}

Rule.prototype.interpret = function(ud){
	// console.log(this.left);
	if (this.quantifier == "some"){
		return exi(this.connective, this.left.name, this.right.name)
	}else if (this.quantifier =="all"){

		return uni(this.connective, this.left.name, this.right.name)

	} else if (this.quantifier == "notall"){
		return !uni(this.connective, this.left.name, this.right.name)
	}else if (this.quantifier == "none"){
		return !exi(this.connective, this.left.name, this.right.name)
	}

	function exi(connective, left, right){
		// console.log(ud)
		// console.log(ud.danger)
			if (connective == "or"){
					if (ud[left].length != 0 || ud[right]!= 0) return true;
					else return false;
			} else if (connective == "and"){
				for (obj in ud[left]){
					for (o in ud.u){
						if(ud[left].indexOf(ud.u[o]) != -1 && ud[right].indexOf(ud.u[o]) != -1 ){
							return true;
						}
					}
				}
				return false;
			} else if (connective == "implies"){
					if (ud[left].length < ud.u.length || ud[right].length != 0){

						return true;
					} else return false;
			}

	}

	function uni(connective, left, right){

		if (connective == "or"){
			console.log(ud);
				for (o in ud.u){
	// left.name].indexOf(ud.u[o])  + " " + ud[this.right.name].indexOf(ud.u[o]) )
					if (ud[left].indexOf(ud.u[o]) == -1 && ud[right].indexOf(ud.u[o]) == -1 ){
						return false;
					}
				}return true;
		}else if (connective == "and"){
				for (o in ud.u){
					if (ud[left].indexOf(ud.u[o]) == -1 || ud[right].indexOf(ud.u[o]) == -1 ){
						return false;
					}
				}return true;
		}else if (connective == "implies"){
				for (o in ud.u){
					if (ud[left].indexOf(ud.u[o]) != -1 && ud[right].indexOf(ud.u[o]) == -1 ){
						return false;
					}
				}return true;
			}
	}

}

Rule.prototype.toString = function(){
	v = randomize.drawOneRandomFromSet(["x","y","z","w"])
	if (this.quantifier == "none"){
	 q = "\\neg \\exists " + v;
 } else if (this.quantifier == "all"){
	q = "\\forall "+ v;
} else if (this.quantifier == "notall"){
	q = "\\neg \\forall "+ v;
}else if (this.quantifier == "some"){
	q = "\\exists "+ v;
 }
	if (this.connective == "and"){
		c = "\\wedge"
	} else 	if (this.connective == "or"){
			c = "\\vee"
		} else if (this.connective == "implies"){
			c = "\\to"
		}
	if (this.left.name == "even") l ="E" + v;
	else if (this.left.name == "odd") l ="O" + v;
	else if (this.left.name == "consonant") l ="C" + v;
	else if (this.left.name == "vowel") l ="V" + v;
	else if (this.left.name == "info") l ="B"+ v;
	else if (this.left.name == "danger") l ="R"+ v;

	if (this.right.name == "even") r ="E"+ v;
	else if (this.right.name == "odd") r ="O"+ v;
	else if (this.right.name == "consonant") r ="C"+ v;
	else if (this.right.name == "vowel") r ="V"+ v;
	else if (this.right.name == "info") r ="B"+ v;
	else if (this.right.name == "danger") r ="R"+ v;

	return "\\(" + q + "(" + l + " "+ c + " " +r + ")\\)"
}



$(function(){

	$head = $('#wasonhead');
	$messagecard = $('#messagecard')
	$message = $('#message')
	$leaderboard = $('#leaderboard');
	$cards = $('#cards');
	$rule = $('#rule');
	$numOfCards = $('#numOfCards')
	var score = 0;
	var passing = 100;
	var $button = $('#wasonbutton');
	var $score = $('#score');
	var $plus = $('#plus');
	var $minus = $('#minus');
	var $numOfCards = $('#numOfCards');
	var secondChance = 0;
	var $buttarea = $('#buttarea')
	$button.text("True")
	$buttarea.append("<button class = 'btn btn-danger btn-block 'type='button' id = 'false'>False </button>");
	var $falseb = $('#false')
	$('#wasonhead').text("QL Interpretation")
	$plus.remove();
	$minus.remove();



function printCards(domain){
	var html = '<div class="btn-group btn-group-lg w-100" id = "wasonCardGroup" data-toggle="buttons">'
	for (card in domain){
		html += domain[card].html;

	}

	html += '</div>'
	return html;
}

function generalInstruction(){
	var html = "<h4>Instruction</h4>"
 html +=' <p>Each card below has a number on one side and a letter on the other. They are either blue or red.</p>'
html += '<p>Your task is to determine if the QL statement given is true or false.</p>'
html += '<p>Choose by clicking the "True" or "False button". You have to start over if you make a mistake. Get the score of ' + passing + ' or above to pass the section.</p>'
html += '<p>The number of cards changes randomly for each trial. You get more points from playing with a higher number of cards: Number of points possible = number of cards showing. </p>'
html += '<p><strong>Note:</strong> There is no card with the number 0 or 1. If you see something that looks like them, it is either the vowel O or the vowel I.</p>'
html += '<p>Rx: x is red, Bx: x is blue, Ex: x is an even card, Ox: x is an odd card, Cx: x is a consonant card, Vx: x is a vowel card.</p>'
html += '<p>UD: the cards below</p>'

	alert($head, "b", html,2);
}

function Score(newScore){
	score = newScore;
	$score.text('Your Score: ' + score);
}
generalInstruction();

	var $cards = $('#cards');


	var x
	x = chance.integer({min: 2, max: 10})
	$numOfCards.text('# of Cards: ' +x)
	var current = new Universe(x);
	// console.log(current)
	ex = (buildExtension(current.domain))

	$cards.html(printCards(current.domain));


	var rule = new Rule(face);
	// console.log(rule);
	// 	console.log(rule.interpret(ex))

	ans = rule.interpret(ex);
	console.log(ans)
	$rule.html(rule.toString());
	mathjax.reload("rule")

	var reset = false;
	Score(0);



	function resetCards(){


		   x = chance.integer({min: 2, max: 10})
			$numOfCards.text('# of Cards: ' + x)
			var current = new Universe(x);
			ex = (buildExtension(current.domain))
			$cards.html(printCards(current.domain));
			rule = new Rule(face);
			ans = rule.interpret(ex);
			console.log(ans)
			$rule.html(rule.toString());
			reset = false;

			alert($head,"b","'<p>Rx: x is red, Bx: x is blue, Ex: x is an even card,  Vx: x is a vowel card.</p>'",3);
			mathjax.reload("rule")
	}




	$button.on('click', function (){
		buttonRes(true);
	})

	$falseb.on('click', function (){
		buttonRes(false);
	})

	function buttonRes(button){
		if (button == ans) correct = true;
		else correct = false;
		if (reset == false){
			reset = true;
			if (correct){
				Score(score + x);
				alert($head, "b","This is correct! Press the red or blue button to continue", 2);
				if (score >= 40 && secondChance ==0) secondChance = 1;
			} else if (secondChance == 1){
				alert($head, "b","<h4>ARE YOU SURE?</h4>", 3);
				secondChance = 3;
				reset = false;
			}
			else {
				var output = "This is incorrect! Your final score is "+ score + ". Press the red or blue button to restart. See if you made it on the leaderboard.";
				if (score > 0){
				jQuery.post("../"+id, {score:score}, function(res){
							leaderboard.draw(id, $leaderboard);
							});
				}
				if (score >= passing){
						jQuery.post("../report", {passed: true, label: "reading_1", moduleNo: 6}, function(res){
							 output += "You passed! "+res;
							 alert($head, "b",output, 1);
							});
							Score(0);
						}else{
						 alert($head, "b",output, 4);
							Score(0);
							leaderboard.draw(id, $leaderboard);

						}


			}
		} else{
			resetCards();
		}
	}



	leaderboard.draw(id, $leaderboard);


}) //end

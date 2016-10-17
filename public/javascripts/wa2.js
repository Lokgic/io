var alert = require('./mods/alert.js')
var randomize = require('./mods/randomize.js')
var leaderboard = require('./mods/leaderboard.js')
var Chance = require('chance')
var chance = new Chance();
var vowels = ['a','e','i','o','u'];
var consonants = ['b', 'h' ,'p', 'z', 'g'];
var number = [2,3,4,5,6,7,8,9]
var all = 'aeiou' + 'bhpzg' + 23456789
var id = "wason2"

var CardObj = function(face){
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
	this.html =	'<label class="btn btn-outline-primary wason text-xs-center" value = ' + this.face + '><input type="checkbox" autocomplete="off"><h1 class = "display-1">' + this.face + '</h1></label>';
}

var Universe = function(n){
	this.domain = {};
	while (n>0){
			var temp = new CardObj;
			if (!this.contains(temp)){
				this.domain[temp.face] = temp;
				n--;
			}
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
	} else {
		this.type = 'letter';
	}
}

Predicate.prototype.truthFunction = function(obj){
	return obj[this.name];
}

Predicate.prototype.negation = function(obj){
	// console.log(obj.type + " vs " + this.type);
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

var Rule = function(parm){
	this.quantifier  = randomize.drawOneRandomFromSet(["existential","universal","notall","none"]);

	order = [];
	for (i in parm){
		order.push(randomize.drawOneRandomFromSet(parm[i]));
	}
	order = randomize.shuffle(order);
	this.left = new Predicate(order[0]);
	this.right =  new Predicate(order[1]);


}

Rule.prototype.toString = function(){
	if (this.quantifier == "existential"){
		return "Some cards have " + this.left.toString() + " on one side but " +  this.right.toString() + " on the other side."
	} else if (this.quantifier == "universal"){
		return randomize.drawOneRandomFromSet([
			"All cards with " + this.left.toString() + " on one side have " + this.right.toString() + " on another.",
			"Any card with " + this.left.toString() + " on one side has " + this.right.toString() + " on another.",
			"For all cards, it is such that if one side is " + this.left.toString() + " then the other side is " + this.right.toString() + "."
		])
	} else if (this.quantifier == "notall"){
		return randomize.drawOneRandomFromSet([
			"Not all cards with " + this.left.toString() + " on one side have " + this.right.toString() + " on the other side.",
			"At least one card with " + this.left.toString() + " on one side does not have " + this.right.toString() + " on the other side."

		])
	} else if (this.quantifier == "none"){
		return randomize.drawOneRandomFromSet([
			"No cards with " + this.left.toString() + " on one side have " + this.right.toString() + " on the other side.",
			"Any card with "  + this.left.toString()  + " is guaranteed not to have " + this.right.toString() + " on the opposite side."
		])
	}
}

Rule.prototype.findAnswer = function(domain){
	var ans = [];
	if (this.quantifier == "existential"|| this.quantifier == "none"){
		for (object in domain){
			// console.log(domain[object].face)
			if (this.left.truthFunction(domain[object]) || this.right.truthFunction(domain[object])){
				ans.push(domain[object].face)
			}
		}
	} else if (this.quantifier == "universal" || this.quantifier == "notall"){
		for (object in domain){
			// console.log(this.right.negation(domain[object]));
			if (this.left.truthFunction(domain[object]) || this.right.negation(domain[object])){
				ans.push(domain[object].face);
			}
		}
	}

	return ans;
}


$(function(){

	$head = $('#wasonhead');
	$messagecard = $('#messagecard')
	$message = $('#message')
	$leaderboard = $('#leaderboard');
	$cards = $('#cards');
	$rule = $('#rule');
	var score = 0;
	var passing = 100;
	var $button = $('#wasonbutton');
	var $score = $('#score');
	var $plus = $('#plus');
	var $minus = $('#minus');
	var $numOfCards = $('#numOfCards');
	var secondChance = 0;




function printCards(domain){
	var html = '<div class="btn-group btn-group-lg w-100" id = "wasonCardGroup" data-toggle="buttons">'
	for (card in domain){
		html += domain[card].html;

	}

	html += '</div>'
	return html;
}

function checkAnswer(answers){
	var checked = $('.active', '.btn-group').children().text().split("");
	// console.log(checked);
	// console.log(answers);
	if (answers.length == 0){
		if (checked.length == 0) return true;
		else return false;
	}
	for (answer in answers){
		if (checked.indexOf(answers[answer])== -1){
			return false;
		}
	}

	for (check in checked){
		if (answers.indexOf(checked[check])== -1){
			return false;
		}
	}
	return true;
}

function generalInstruction(){
	var html = "<h4>Instruction</h4>"
 html +=' <p>Each card below has a number on one side and a letter on the other. </p>'
html += '<p><em>Your task is to turn over the <strong>minimum</strong> number of cards required to determine whether the statement is true or false.</em></p>'
html += '<p>Choose by clicking the card(s) and then press "Button". You have to start over if you make a mistake. Get the score of ' + passing + ' or above to pass the section.</p>'
html += '<p>You can adjust the difficulty by increasing or decreasing the number of cards by pressing + or -. You get more points from playing with a higher number of cards: Number of points possible = number of cards showing. </p>'
html += '<p><strong>Note:</strong> There is no card with the number 0 or 1. If you see something that looks like them, it is either the vowel O or the vowel I.</p>'

	alert($head, "b", html,2);
}

function Score(newScore){
	score = newScore;
	$score.text('Your Score: ' + score);
}

// function initCards (n){
// 		var allcards = [];
// 		allcards = allcards.concat(vowels);
// 		allcards = allcards.concat(consonants);
// 		allcards = allcards.concat(number);
// 		var output = randomize.sample(allcards, n);
// 		return output;
// 		}

	var $cards = $('#cards');

	var possibility = [["even", "odd"], ["consonant", "vowel"]];
	var x = 6;

	var current = new Universe(x);
	// console.log(current.findAnswer);
	$cards.html(printCards(current.domain));

	// test = new Rule(possibility);
	// console.log(test);
	// test.findAnswer(current.domain);
	// for (card in current.domain){
	// 	console.log(test.left.truthFunction(current.domain[card]));
	// }
	var rule = new Rule(possibility);
	ans = rule.findAnswer(current.domain);
	$rule.html(rule.toString());

	var reset = false;
	Score(0);
	generalInstruction();

	function resetCards(){
			current = new Universe(x);
			$cards.html(printCards(current.domain));
			rule = new Rule(possibility);
			// console.log(rule.findAnswer(current.domain))
			// ans = makeAnswer(rule, current);
			// console.log(ans);
			$rule.html(rule.toString());
			reset = false;
			alert($head,"b","Which card(s) must you turn over in order to verify the statement below?",3);

	}

	$plus.on('click', function (){
		if (x < 18)	{
			x++;
			resetCards();
			$numOfCards.text("# of Cards : " + x);
		}

	})

	$minus.on('click', function (){
		if (x > 1) {
			x--;
			resetCards();
			$numOfCards.text("# of Cards : " + x);
		}
	})


	$button.on('click', function (){
		if (reset == false){
			reset = true;
			if (checkAnswer(rule.findAnswer(current.domain))){
				Score(score + x);
				alert($head, "b","This is correct! Press the button to continue", 2);
				if (score >= 40 && secondChance ==0) secondChance = 1;
			} else if (secondChance == 1){
				alert($head, "b","<h4>ARE YOU SURE?</h4>", 3);
				secondChance = 3;
				reset = false;
			}
			else {
				var output = "This is incorrect! Your final score is "+ score + ". Press the button to restart. See if you made it on the leaderboard.";
				if (score > 0){
				jQuery.post("../"+id, {score:score}, function(res){
				    	leaderboard.draw(id, $leaderboard);
				      });
				}
				if (score >= passing){
				    jQuery.post("../report", {passed: true, label: "reading_1", moduleNo: 4}, function(res){
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
	})
	leaderboard.draw("wason2", $leaderboard);


}) //end

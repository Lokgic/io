(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var makeAlert = function(location, direction, text, code){ //direction: a= above, b=below
  /////This takes care of the HTML
  var tag;
  if (code == 0){
	if (direction == "a"&& $(location).prev().hasClass("alert")){
          $(location).prev().remove();
        }
      if (direction == "b" && $(location).next().hasClass("alert")){
          $(location).next().remove();
        }
  }
  else if (code == 1){tag = "alert-success";}
  else if (code == 2){tag = "alert-info";}
  else if (code == 3){tag = "alert-warning"}
  else{tag = "alert-danger"}
  var html = "<div class='alert " + tag +  " alert-dismissible fade in m-x-1' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+text+"</div>";

  if (direction == "a"){
    if ($(location).prev().hasClass("alert")) {
      $(location).prev().remove();
    }
    $(location).before(html);
    }

  if (direction == "b"){
    if ($(location).next().hasClass("alert")) {
      $(location).next().remove();
    }
    $(location).after(html);
    }

  }

 module.exports = makeAlert;
},{}],2:[function(require,module,exports){
var draw = function drawHTML(game, location){
		ping(game, function(data){
			var html = '<table class="table table-hover"><thead class="thead-inverse"><tr><th>#</th><th>Name</th><th>Score</th></tr></thead><tbody>';
			var k = 1;
			for (object in data){
				html += '<tr><th score="row"> ' + k + '</th>';
				html += '<td class = "lead">' + data[object].name +'</td>';
				html += '<td class = "lead">' + data[object].score +'</td>'
				
				html += '</tr>'
				k++;
			}
			html += '</tbody></table>'
			location.html(html);
		})
	}

var ping = function ping(game, callback){
		jQuery.post("../ranking", {game:game}, function (res){
			return callback(res);
		})
	}


var all = {
	draw: draw,
	ping: ping
}
module.exports = all;
},{}],3:[function(require,module,exports){
var randomize = {
  oneNumber: function(n){
     return Math.floor(Math.random()* n) + 1
  },
  drawOneRandomFromSet: function(set) {
        return  set[Math.floor(Math.random()* set.length)];
        },

  shuffle: function(arr) {
    var currentI = arr.length, tempValue, randomI;

    while (0!== currentI){
      randomI = Math.floor(Math.random() * currentI);
          currentI -= 1;

          tempValue = arr[currentI];
          arr[currentI] = arr[randomI];
          arr[randomI] = tempValue;
        }

        return arr;
      },
    chooceProbabilistically: function(set, probability){

    var n = Math.random();
    var low = 0;
    var outcome;
    for (var i = 0; i<set.length;i++){
      if (low<n&&n<probability[i]){
        low = probability[i];
        outcome = set[i];
      }
    }
      return outcome;
    },

    sample: function(set, n){
    	var newSet = randomize.shuffle(set);
    	var output =[];
    	for (var i= 0; i<n; i++){
    		output.push(newSet.pop());
    	}
    	return output;
    }

  }

module.exports = randomize;

},{}],4:[function(require,module,exports){
var alert = require('./mods/alert.js')
var randomize = require('./mods/randomize.js')
var leaderboard = require('./mods/leaderboard.js')

$(function(){


	$head = $('#wasonhead');
	$messagecard = $('#messagecard')
	$message = $('#message')
	$leaderboard = $('#leaderboard');
	$cards = $('#cards');
	$rule = $('#rule');
	var score = 0;
	var passing = 60;
	var $button = $('#wasonbutton');
	var $score = $('#score');
	var $plus = $('#plus');
	var $minus = $('#minus');
	var $numOfCards = $('#numOfCards');
	var secondChance = 0;




function printCards(cards){
	var html = '<div class="btn-group btn-group-lg w-100" id = "wasonCardGroup" data-toggle="buttons">'
	for (card in cards){
		html+='<label class="btn btn-outline-primary wason text-xs-center" value = ' + cards[card] + '>';
		html += '<input type="checkbox" autocomplete="off">';
		html += '<h1 class = "display-1">' + cards[card] + '</h1>';
		html+='</label>';

	}

	html += '</div>'
	return html;
}

function makeRule(options){

	rule = [];
	for (i in options){
		rule.push(randomize.drawOneRandomFromSet(options[i]));
	}
	rule = randomize.shuffle(rule);
	return rule;
}

function printRule(rule){
	var seed = randomize.drawOneRandomFromSet([1, 2, 3, 4, 5,6, 7,8]);
	if (seed === 1) {return "if one side of the card is " + rule[0] + ", then the other side must be " + rule[1];}
		else if (seed === 2) {return "one side of the card is " + rule[0] + " only if the other side is " + rule[1];}
		else if (seed === 3) {return "a card cannot have " + rule[0] + " on one side without having " + rule[1] + " on another side";}
		else if (seed === 4) {return "one side of card is " + rule[1] + " if it has " + rule[0] + " on another side";}
		else if (seed === 5) {return "having "+ rule[1] + " on one side is a necessary condition for having " + rule[0] + " on the other side.";}
		else if (seed === 6) {return "having "+ rule[0] + " on one side is a sufficient condition for having " + rule[1] + " on the other side.";}
		else {return "having " + rule[0] + " on one side implies that the other side is " +rule [1]}

}

function makeAnswer(rule, cards){
	var answer = [];
	if (rule[0] === "an even number"|| rule[1] === "an odd number") {
			for (var i = 0; i < cards.length; i++){
				if (cards[i] % 2 === 0){answer.push(cards[i].toString())}
			} //end for loop
		} else if (rule[0] === "an odd number"|| rule[1] === "an even number") {
			for (var i = 0; i < cards.length; i++){
				if (cards[i] % 2 === 1){answer.push(cards[i].toString())}
			} //end for loop
		}


	if (rule[0] === "a vowel"|| rule[1] === "a consonant") {
			for (var i =0; i< cards.length;i++){
				if (vowels.indexOf(cards[i])!= -1){
					answer.push(cards[i]);
				}
			}

		} else if (rule[0] === "a consonant" || rule[1] === "a vowel") {
			for (var i = 0; i < cards.length; i++){
				if(consonants.indexOf(cards[i])!= -1){
					answer.push(cards[i]);
				}
			}
		}


	return answer;
}

function checkAnswer(answers){
	var checked = $('.active', '.btn-group').children().text().split("");
	console.log(checked);
	console.log(answers);
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

function initCards (n){
		var allcards = [];
		allcards = allcards.concat(vowels);
		allcards = allcards.concat(consonants);
		allcards = allcards.concat(number);
		var output = randomize.sample(allcards, n);
		return output;
		}

	var $cards = $('#cards');
	var vowels = ['a','e','u','i','o'];
	var consonants = ['b','h','p','z','g'];
	var number = [2,3,4,5,6,7,8,9]
	var possibility = [["an even number", "an odd number"], ["a consonant", "a vowel"]];
	var x = 6;

	var current = initCards(x);
	$cards.html(printCards(current));
	var rule = makeRule(possibility);
	var ans = makeAnswer(rule, current);
	$rule.html(printRule(rule));

	var reset = false;
	Score(0);
	generalInstruction();

	function resetCards(){
			current = initCards(x);
			$cards.html(printCards(current));
			rule = makeRule(possibility);
			ans = makeAnswer(rule, current);
			console.log(ans);
			$rule.html(printRule(rule));
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
			if (checkAnswer(ans)){
				Score(score + x);
				alert($head, "b","This is correct! Press the button to continue", 2);
				if (score >= 40 && secondChance ==0) secondChance = 1;
				console.log(secondChance);
			} else if (secondChance == 1){
				alert($head, "b","<h4>ARE YOU SURE?</h4>", 3);
				secondChance = 3;
				reset = false;
			}
			else {
				var output = "This is incorrect! Your final score is "+ score + ". Press the button to restart. See if you made it on the leaderboard.";
				if (score > 0){
				jQuery.post("../wason", {score:score}, function(res){
				    	leaderboard.draw("wason", $leaderboard);
				      });
				}
				if (score >= passing){
				    jQuery.post("../report", {passed: true, label: "reading_1", moduleNo: 2}, function(res){
				       output += "You passed! "+res;
				       alert($head, "b",output, 1);
				      });
				    	Score(0);
  					}else{
  					 alert($head, "b",output, 4);
  					  Score(0);
  					  leaderboard.draw("wason", $leaderboard);

  					}


			}
		} else{
			resetCards();
		}
	})
	leaderboard.draw("wason", $leaderboard);


}) //end

},{"./mods/alert.js":1,"./mods/leaderboard.js":2,"./mods/randomize.js":3}]},{},[4]);

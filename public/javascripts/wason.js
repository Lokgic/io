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
			// console.log(ans);
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

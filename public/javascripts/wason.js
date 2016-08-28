$(function(){
	var $content = $(".content");
	var $rule = $("#rule");
	var $confirm = $("#confirm");
	var $interaction = $("#interaction");
	var $instruction = $("#instruction");
	var $reload = $("#reload");
	var $retry = $("#retry");
	 function makeBinary(){
	 	return  Math.floor(Math.random()* 2);
	}


/* Multiple Color function

	function makeColor() {
		var seed  = Math.floor(Math.random()* 4);
		var hex = "";
		for (var i = 1; i < 4; i++){
			if (seed == 0){
				hex = "000";
				break;
			}else if (i === seed){
				hex += "7"

			}else{
				hex += "0"
			}

		}

		return hex;
	}
*/
	
	function drawRandom(set){
		return 	set[Math.floor(Math.random()* set.length)];
	}


	function makeRule(){
		rule = []
			rule.push(drawRandom(possibility));
			if (rule[0] === "an even number" || rule[0] === "an odd number")
				{rule.push(drawRandom(possibility.slice(2,4)))}
			else {rule.push(drawRandom(possibility.slice(0,2)))}
		return rule;
	}

	function expressRule(rule){
		var seed = drawRandom([1, 2, 3, 4, 5,6, 7]);
		if (seed === 1) {return "if one side of the card is " + rule[0] + ", then the other side must be " + rule[1];}
		else if (seed === 2) {return "one side of the card is " + rule[0] + " only if the other side is " + rule[1];}
		else if (seed === 3) {return "a card cannot have " + rule[0] + " on one side without having " + rule[1] + " on another side";}
		else if (seed === 4) {return "one side of card is " + rule[1] + " if it has " + rule[0] + " on another side";} 
		else if (seed === 5) {return "it is necessary for a card to have " + rule[1] + " on one side in order for it to have " + rule[0] + " on the other side";}
		else if (seed === 6) {return "The sufficient condition for a card to have " + rule[1] + " on one side, is for it to have " + rule[0] + " on another";}
		else {return "having " + rule[0] + " on one side implies that the other side is " +rule [1]}
	}

	function makeAnswer(rule){
		var answer = [];
		if (rule[0] === "an even number"|| rule[1] === "an odd number") {
			for (var i = 1; i < 11; i++){
				if (i % 2 === 0){answer.push(i)}
			} //end for loop		
		} //end conditional on even
		else if (rule[0] === "an odd number"|| rule[1] === "an even number") {
			for (var i = 1; i < 11; i++){
				if (i % 2 === 1){answer.push(i)}
			} //end for loop		
		} //end conditional on odd
		if (rule[0] === "a vowel"|| rule[1] === "a consonant") {
			answer = answer.concat(vowels);	
		} //end conditional on vowel
		else if (rule[0] === "a consonant" || rule[1] === "a vowel") {
			answer = answer.concat(consonants);} // antecedent consonant or consequent vowel
		return answer;
	}

	function checkAnswer(input, answers){
		for (var i = 0; i < answers.length; i++){
			if (answers[i] === input){
				return true;
			}

		}
		return false;;

	}

	function makeResponse(input, answers){
		var right = [];
		var wrong = [];
		var missed = [];
		var specificanswers = [];

		for (var i = 0; i < cards.length; i++){

			if (checkAnswer(cards[i], answers))
				   {specificanswers.push(cards[i]);
			   }
		} //get a set of current right cards, since cards is the set of all POSSIBLE ONES

		for (var i = 0; i < input.length; i++){
			if (checkAnswer(input[i], answer) === true){
				right.push(input[i]);
			} else {wrong.push(input[i]);
		}

		} //looping over all answers to check input answers, output right and wrong 

		for (var i = 0; i<specificanswers.length; i++){
			if (checkAnswer(specificanswers[i], right) === false){
				missed.push(specificanswers[i]);
			}//This gets the missed answer by comparing what the agent got right and all the actual right asnwers.

		}

		return [right, wrong, missed];
	}

	function makeCards (n){
		var allcards = [];
		allcards = allcards.concat(vowels);
		allcards = allcards.concat(consonants);
		allcards = allcards.concat(number);
		var output = [];
		for (var i = 0; i < n ; i ++){
			var draw = drawRandom(allcards);
			output = output.concat(draw);
			allcards.splice(allcards.indexOf(draw), 1);

		}
		return output;
		}

	/*** Printing out stuff *////
	function printRule(rule){
		$rule.html('<p>"' + expressRule(rule) + '"</p>');
	}

	function printCards(cards){
		var html = "<form>";
		for (var i = 0; i < cards.length; i++){
			html += "<label for= '"+cards[i]+"'><div><p>" + cards[i] + "</p><input type ='checkbox' class = 'box' id = " + cards[i] +" value = "+ cards[i] +"></label></div>";
		}
		html += "</form>"
		$content.append(html);
	};

	function print(x){
		return console.log(x);
	}

	$confirm.on('click', function(){
		var input = [];
		var message = "";
		for (var i = 0; i<cards.length; i++){
			if (document.getElementById(cards[i]).checked){
				input.push(cards[i]);
			}
		}
		$confirm.hide();
		$retry.show();
		var tally = makeResponse(input, answer)
		result = interpretResult(tally);
		var reload = "<button id = 'reload'> Start Over with New Cards</button>";
		var tryagain = "<button id = 'retry'> Try This Again </button>";

		if (result === 1) {
			message = "Spot on!";}
		else if (result === 2) {
			message = "Everything you picked was wrong! That's messed up!";}
		else if (result === 3) {
			message = "At least one card needs to be turned over! Don't be lazy!";}
		else if (result === 4) {
			message = "Yup, there's nothing to learn from turning any of the cards over. Almost tricked you, didn't I?";}
		else if (result === 5){
			message = "Not quite! This is how you did:<br> Right card picked: " + tally[0].length + "<br>Wrong card picked: " + tally[1].length + "<br>Card Missed: " + tally[2].length;
		}

		$instruction.html("<p>" + message + "</p>");

	})

	$reload.on('click', function(){
		location.reload();
		})

	$retry.on('click', function(){
		$confirm.show();
		$retry.hide();
		$instruction.html("<p>Alright, give it another go! Which card(s) must you turn over in order to verify the statement above?</p>");
		})
	$retry.hide();



	function interpretResult (result){
		if (result[1].length === 0 && result[2].length === 0 && result[0].length > 0){ // case 1: agent gets everything right - no missed no wrong answers
			return 1;} 
		else if (result[0].length === 0 && result[2].length === 0 && result[1].length > 0){ // case 2: agent gets everything wrong - no missed no right answers
			return 2;}
		else if (result[0].length === 0 && result[1].length === 0 && result[2].length > 0){ // case 3: agent didn't enter anything and missed some
			return 3;}
		else if (result[0].length === 0 && result[1].length === 0 && result[2].length === 0){ // case 4: agent didn't enter anything but didn't miss anything
			return 4;} 
		else 
		{return 5;}
	}

/******Begining Parameter of the Game *///////
	var vowels = ['a','e','u','i'];
	var consonants = ['b','h','p','z'];
	var number = [1,2,3,4,5,6,7,8,9]
	var possibility = ["an even number", "an odd number", "a consonant", "a vowel"];

/* game initiation*/
	var rule = makeRule();
	var cards = (makeCards(4));


	printRule(rule);
	printCards(cards);
	var answer = makeAnswer(rule);
	
	


	//var x = makeNumber();
	//console.log(x);
	//var html ="<div style = 'background-color: #"+ makeColor() + "'></div>";
	//console.log(even(x));
	//$content.append(html);




}) //end
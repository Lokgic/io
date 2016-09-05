$(function(){

	$cards = $('#cards');
	$rule = $('#rule');
	var score = 0;
	var $button = $('#wasonbutton');

function makeAlert(location, direction, text, code){ //direction: a= above, b=below
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
  var html = "<div class='alert " + tag +  " alert-dismissible fade in' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+text+"</div>";

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
var randomize = {
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


function printCards(cards){
	var html = '<div class="btn-group" data-toggle="buttons">'
	for (card in cards){
		html+='<label class="btn btn-primary m-x-1 wason" value = ' + cards[card] + '>';
		html += '<input type="checkbox" autocomplete="off">';
		html += '<h1 class = "display-2">' + cards[card] + '</h1>';
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
	var seed = randomize.drawOneRandomFromSet([1, 2, 3, 4, 5,6, 7]);
	if (seed === 1) {return "if one side of the card is " + rule[0] + ", then the other side must be " + rule[1];}
		else if (seed === 2) {return "one side of the card is " + rule[0] + " only if the other side is " + rule[1];}
		else if (seed === 3) {return "a card cannot have " + rule[0] + " on one side without having " + rule[1] + " on another side";}
		else if (seed === 4) {return "one side of card is " + rule[1] + " if it has " + rule[0] + " on another side";} 
		else if (seed === 5) {return "having "+ rule[1] + "on one side is a necessary condition for having " + rule[0] + " on the other side.";}
		else if (seed === 6) {return "having "+ rule[0] + "on one side is a sufficient condition for having " + rule[1] + " on the other side.";}
		else {return "having " + rule[0] + " on one side implies that the other side is " +rule [1]}

}

function makeAnswer(rule, cards){
	var answer = [];
	if (rule[0] === "an even number"|| rule[1] === "an odd number") {
			for (var i = 0; i < cards.length; i++){
				if (cards[i] % 2 === 0){answer.push(cards[i])}
			} //end for loop		
		} else if (rule[0] === "an odd number"|| rule[1] === "an even number") {
			for (var i = 0; i < cards.length; i++){
				if (cards[i] % 2 === 1){answer.push(cards[i])}
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
	var checked = $('.active', '.btn-group').children().text();
	for (answer in answers){
		if (checked.indexOf(answers[answer])== -1){
			return false;
		} else {
			return true;
		}
	}
}

function generalInstruction(){
var html =' <p class = "lead">Suppose each card has a number on one side and a letter on the other. </p>'
html += '<p class = "lead">Which of these cards MUST be turned over if you want to know if the statement above them is FALSE?</p>'
html += '<p class = "lead">Choose by clicking the card(s) and then press "Confirm Answer".'

	makeAlert($button, "b", html,2);
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
	var vowels = ['a','e','u','i'];
	var consonants = ['b','h','p','z'];
	var number = [1,2,3,4,5,6,7,8,9]
	var possibility = [["an even number", "an odd number"], ["a consonant", "a vowel"]];

	var current = initCards(4);
	$cards.html(printCards(current));
	var rule = makeRule(possibility);
	var ans = makeAnswer(rule, current);
	$rule.html(printRule(rule));
	console.log(ans);
	var reset = false;
	generalInstruction();
	$button.on('click', function (){
		if (reset == false){
			reset = true;
			if (checkAnswer){
				score++;
				console.log(score);
				makeAlert($button, "b","Correct", 1);
			}else {
				makeAlert($button, "b","Incorrect", 4);
			}
		} else{
			current = initCards(4);
			$cards.html(printCards(current));
			rule = makeRule(possibility);
			ans = makeAnswer(rule, current);
			$rule.html(printRule(rule));
			generalInstruction();
			reset = false;
			
		}
	})

}) //end
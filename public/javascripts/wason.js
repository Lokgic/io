$(function(){
	$messagecard = $('#messagecard')
	$message = $('#message')
	$leaderboard = $('#leaderboard');
	$cards = $('#cards');
	$rule = $('#rule');
	var score = 0;
	var passing = 1;
	var $button = $('#wasonbutton');
	var $score = $('#score');
	var $plus = $('#plus');
	var $minus = $('#minus');
	var $numOfCards = $('#numOfCards');

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
	var seed = randomize.drawOneRandomFromSet([1, 2, 3, 4, 5,6, 7]);
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
var html =' <p >Suppose each card has a number on one side and a letter on the other. </p>'
html += '<p >Which of these cards MUST be turned over if you want to know if the statement above them is FALSE?</p>'
html += '<p>Choose by clicking the card(s) and then press "Button". You have to start over if you make a mistake. Get the score of ' + passing + ' or above to pass the section.'
html += '<p>You can adjust the difficulty by increasing or decreasing the number of cards. The score you get is directly correlated to the number of cards for each trial.'

	makeAlert($cards, "a", html,2);
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
	var consonants = ['b','h','p','z'];
	var number = [1,2,3,4,5,6,7,8,9]
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
			makeAlert($cards,"a","Which card(s) must you turn over in order to verify the above statement?",3);

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
				makeAlert($cards, "a","This is correct! Press the button the continue", 2);
			}else {
				var output = "This is incorrect! Your final score is "+ score + ". Press the button the restart";
				if (score > passing){				
				    jQuery.post("../report", {passed: true, label: "reading_1", moduleNo: 2}, function(res){
				       output += "You passed! "+res;
				       makeAlert($cards, "a",output, 1);
				      });
				    jQuery.post("../wason", {score:score}, function(res){
				    	pingLeaderboard();
				      });
				    	Score(0);
  					}else{
  					 makeAlert($cards, "a",output, 4);
  					  Score(0);
  					  pingLeaderboard();

  					}
  				
				
			}
		} else{
			resetCards();
		}
	})

	// function makeMessage(msg, code){
	// 	$messagecard.removeClass();
	// 	$messagecard.addClass("card card-"+code);
	// 	$message.text(msg)
	// }



	function makeLeaderboard(data){
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
		$leaderboard.html(html);

	}
	function pingLeaderboard(){
		jQuery.post("../ranking", {game:"wason"}, function (res){
			makeLeaderboard(res);
		})
	}
	
	// makeMessage("test", "inverse")
	pingLeaderboard();

}) //end
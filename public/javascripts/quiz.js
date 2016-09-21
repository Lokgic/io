(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var randomize = require('./randomize.js')

var lineleft = 'style ="border-right: 0px;border-bottom: 0px;border-top: 0px;border-left: 1px ;border-style: solid;"';




var draw = function(proof){
  var maxcol = 2
  var html = '<table class="table table-sm"><tbody>';
  var num = 0
  for (line in proof){
    num++;
    html += '<tbody><tr><th scope="row" >'+ num+'</th>';

    if (proof[line].scope > 1){
      console.log(proof[line].content + " " + proof[line].scope);
      for (var i = 1; i < proof[line].scope; i++){
        html +=' <td '+ lineleft +'> </td>';
      }

    }

    html +=' <td colspan="' + (maxcol + 1  - proof[line].scope) +'"'+ lineleft + '>';

    html += proof[line].content + '</td>';
    html += '<td>' + proof[line].justification + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>'
  return html;
}

var randomJustification = function(proof){
  var maxcol = 2
  var html = '<table class="table table-sm"><tbody>';
  var num = 0
  var question = 1;
  while (proof[question - 1].justification == "Given"||proof[question - 1].justification == "Assumption"){
    question = randomize.oneNumber(proof.length);
  }
  console.log(question);
  for (line in proof){
    num++;
    html += '<tbody><tr><th scope="row" >'+ num+'</th>';

    if (proof[line].scope > 1){
      for (var i = 1; i < proof[line].scope; i++){
        html +=' <td '+ lineleft +'> </td>';
      }

    }

    html +=' <td colspan="' + (maxcol + 1  - proof[line].scope) +'"'+ lineleft + '>';

    html += proof[line].content + '</td>';
    if (num != question) html += '<td>' + proof[line].justification + '</td>';
    else html += '<td></td>';
    html += '</tr>';
  }
  html += '</tbody></table>'
  return html;
}

module.exports = {draw: draw,
                  randomJustification: randomJustification}

},{"./randomize.js":3}],2:[function(require,module,exports){
var mathJax = {
  load: function () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
  document.getElementsByTagName("head")[0].appendChild(script);
  },
  reload: function(id){
    id = id || "";
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,id]);

  }
}



module.exports = mathJax;

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

$(function() {
	var $progresscap = $('#progresscap');
	var $progressbar = $('.progress');
	var $question = $('#question');
	var $submit = $('#submit');
	var $answerList = $('#answers');
	var $next = $('#next');
	var $main = $('#quizcard');
	var $header = $('#quizheader');
	var $alertdiv = $('#quizalertdiv');
	var $alert = $('.quizalert');
	var $choice = $('.choice');
	var score;
	var answered;
	var perfectScore;
	var moduleNo = $("title").attr('id');
	var randomize = require('./mods/randomize.js')
	var mathJax = require('./mods/mathjax.js')
	var deduction = require('./mods/deduction.js')


	function resetQuizCard(){
			$main.removeClass("card-danger");
		   	$main.removeClass("card-success");
		   	makeAlert($main, "a","",0)
	}




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

	function askDeduction(q){
		if (q.setuptype == "mc"){
			$question.html(deduction.draw(q.derivation));
		}

	}

	function askMC(q){
		//prepare Q nd A
		var answers = [];
		Array.prototype.push.apply(answers, q.fake); //get around answers arrary not being empty when quiz restarts
   		answers.push(q.real);
   		randomize.shuffle(answers);
   		var question ="";
   		question+='<p class = "lead">'  + q.question + '</p>';
   		//Detect special setup
   		if ("setup" in q) {
   			if ("setuptype" in q){
   				if(q.setuptype == "list"){
   					question+='<ul  class="list-group">';
   					for (var i = 0; i<q.setup.length;i++){

   						question+='<li class="list-group-item lead">';
   						question  += '<span class="tag tag-default tag-pill pull-xs-left m-x-2">'+ q.setup[i][0]+'</span>';
   						question+= q.setup[i][1] + '</li>';
   					}
   					question+= "</ul>"
   				}
   			}else{
   			question +='<p class = "lead">'  + q.setup + '</p>'
   			}
   		}

   		//Print Q and A
   		$question.html(question);

   		$answerList.html("");
		for (var i = 0; i <answers.length; i++){

			var htmlHead = '<li class="list-group-item"><button type="button" class="btn btn-primary  choice" value = "' + answers[i] + '">' + (i + 1) + '</button>' + answers[i]+'</li>';
			$answerList.append(htmlHead);
		}
		activateButton(q);

	}

  function checkDropdownAnswer(obj){
      var selectorTag = " option:selected";

      var correct =0;
      for (var i = 0; i < obj.questions.length;i++){
        var $targetInput = $("#" + obj.id + i+ selectorTag);
        if ($targetInput.val().toLowerCase().trim() == obj.questions[i][1].toLowerCase().trim()) correct++;
      }
      // console.log(correct + " out of "+ obj.questions.length);
      if (correct == obj.questions.length) return true;
        else return correct;

    }

	function activateButton(q){
		$(".choice").on("click", function(e){
			e.preventDefault();
			$(".choice").attr("disabled", true)
			if (q.type == "mc"){
		   		var chosen = $(e.target).val();
		   		respondToAnswer(chosen == q.real);
		   	} else if (q.type == "dropdown"){
		   		respondToAnswer(checkDropdownAnswer(q));
		   	}

	     });
	}

	function respondToAnswer (right){

		if(right !== true){
			if (typeof right === "number"){
				makeAlert($main, "a", "You got " + right + " correct answers",4);
			    	$main.addClass("card-danger");
			    	$next.attr("disabled", false);
			    	answered++;
			    	updateProgress(answered, perfectScore, score);
			} else {
				makeAlert($main, "a", "Opps, that was wrong.",4);
			    	$main.addClass("card-danger");
			    	$next.attr("disabled", false);
			    	answered++;
			    	updateProgress(answered, perfectScore, score);
			    }
		    } else{
		    	makeAlert($main, "a","That's correct!",1);
			    	$main.addClass("card-success");
			    	$next.attr("disabled", false);
			    	score += 1;
					answered++;
			    	updateProgress(answered, perfectScore, score);

		    }
	}




    function askDropdown(obj) {
    	//create list of possibilities
	 dropdownItems += '<option>Answer</option>';
        var dropdownItems;
        for (var i = 0; i < obj.possibleAnswers.length; i++){
          dropdownItems += '<option value ="'+obj.possibleAnswers[i]+'">' + obj.possibleAnswers[i] + '</option>';
        }


        var html = '<p class="font-italic">' + obj.instruction +'<p>';

         html  += '<p class="lead">' + obj.question +'<p>';
      html += '<form>';

        if (obj.setuptype == "runon"){
        	html +='<p class = "lead m-x-1">';
	        for (var i = 0;i<obj.questions.length;i++){
	        	var tempLabel = obj.id + i;
	         html+= obj.questions[i][0] +  '  <select style="width: auto; display: inline" class="form-control" id ='+ tempLabel +'>' + dropdownItems + '</select>  '
		     }
		     html += "</p>";
        } else{
	         for (var i = 0;i<obj.questions.length;i++){
	          var tempLabel = obj.id + i;
	           html += '<div class="form-group row">';
	            html += '<label id = ' + tempLabel +'label class="col-md-10 col-form-label col-xs-12" for = ' + tempLabel + '>' + obj.questions[i][0] + '</label>'
	           html+= '<div class= "col-md-4 col-xs-12"><select class="form-control" id ='+ tempLabel +'>';
	           html += dropdownItems;
	           html += '</select></div></div>'
	         }
	     }
       html += '</form>';
       $question.html(html);
       var answerButton = '<button type="button" class="btn btn-primary  choice pull-xs-right">Submit Answer</button>'
       $answerList.html(answerButton);
       activateButton(obj);
    }

    function updateProgress(answered, total, right){
     	$progresscap.html("Answered: " + answered + " Total: " + total + " Correct: " + right);
     	$progressbar.attr("value", answered);
     }

   $.getJSON('../json/quiz' + moduleNo +'.json')
     .done(function(data){
     	 var ask = {};
   		ask.mc = askMC;
   		ask.dropdown = askDropdown;
			ask.deduction = askDeduction;
	    var currentQuestion;
	    var quizOver;
	    var quiz;

     	function quizInit(){
     		resetQuizCard();
       		quiz = randomize.shuffle(Object.keys(data).map(function(value) {
							         return data[value]}));
       		score = 0;
       		answered = 0
       		perfectScore = quiz.length;
       		$progressbar.attr("max", perfectScore);
       		updateProgress(answered, perfectScore, score);
	    	currentQuestion = quiz.pop();
	    	quizOver = false;
	        $next.attr("disabled", true);
	   		ask[currentQuestion.type](currentQuestion);
				mathJax.reload(quizcard);

   		}

  		quizInit();
        $next.on('click', function(){
       	if (quiz.length !== 0){
			   	var currentQuestion = quiz.pop();
			   	ask[currentQuestion.type](currentQuestion);
			   	$next.attr("disabled", true);
			   	resetQuizCard();
					mathJax.reload(quizcard);
			   } else{
			   	if (quizOver == false){
			   		resetQuizCard();
			   		scoring(score,perfectScore);
			   		quizOver = true;
			   		makeAlert($main, "a", "Press Continue to restart the quiz.", 3)
			   	} else{
			   		// restart quiz
			   		quizInit();
			   	}

			   }
	       });

    function scoring(actualScore, perfectScore){
    	$question.html("<p class='lead'>You got " +actualScore + " out of " + perfectScore + ".</p>");
    	$answerList.html("");

    	if(actualScore===perfectScore){
			   	$question.append("You passed! Press continue to review the quiz.");
			   	// Generate answers? Maybe
			   	jQuery.post("/report", {moduleNo: moduleNo, label : "quiz"}, function(res){
			   		$question.append('<p>'+res+'</p>');
		   		});
		   	}else {
		   		$question.append("Unfortunately, you didn't pass! You need to get all " + perfectScore + " questions correct to pass. But it doesn't cost anything to take the quiz, so why not try again?");
		   		makeAlert($main, "a", "Press 'Continue' to restart the quiz.", 3)
		   	}
    }




     }).fail(function(){$question.html('<p> Failed to Load Quiz</p>')});

})

},{"./mods/deduction.js":1,"./mods/mathjax.js":2,"./mods/randomize.js":3}]},{},[4]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
  var makeAlert = require('./mods/alert.js')

  $('body').append('<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog" id = "answermodal"></div></div>');

	function resetQuizCard(){
			$main.removeClass("card-danger");
		   	$main.removeClass("card-success");
		   	makeAlert($main, "a","",0)
	}


  function activateButton(q){
		$(".choice").on("click", function(e){
			e.preventDefault();
			$(".choice").attr("disabled", true)
		   		var chosen = $(e.target).val();
          if (chosen == "Yes")	respondToAnswer(true);
          else respondToAnswer(false);
	     });
	}

	function ask(q){
		//prepare Q nd A
   		var question = '<p class = "lead">Prove the following, and then evaluate your derivation by comparing it to the model answer. DO NOT use derived rules or rules of replacement unless the problem is marked with a "*". <button class="btn btn-sm btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">See Model Answer</button></p>';
   		//Detect special setup

   		//Print Q and A
   		$question.html(question);
      $question.append(q[0]);
      mathJax.reload(question);
      var modal = '<div class="modal-content"><img src = "/img/SL/' + q[1] + '.png" class = "img-fluid"></div>'
      $('#answermodal').html(modal);

			var htmlHead = '<li class="list-group-item"><button type="button" class="btn btn-primary  choice" value = "Yes">&#10004;</button> Based on my honest assessment, my proof is correct.</li><li class="list-group-item"><button type="button" class="btn btn-primary  choice" value = "No">&#10008;</button> Based on my honest assessment, I did not carry out the proof correctly.</li>';
			$answerList.html(htmlHead);

		activateButton(q);

	}


	function respondToAnswer (right){

		if(right !== true){

				makeAlert($main, "a", "Thanks for being honest!",4);
			    	$main.addClass("card-danger");
			    	$next.attr("disabled", false);
			    	answered++;
			    	updateProgress(answered, perfectScore, score);

		    } else{
		    	makeAlert($main, "a","Nice job. Remember to check with Lok if you are not sure about your answer!",1);
			    	$main.addClass("card-success");
			    	$next.attr("disabled", false);
			    	score += 1;
					answered++;
			    	updateProgress(answered, perfectScore, score);

		    }
	}





    function updateProgress(answered, total, right){
     	$progresscap.html("Answered: " + answered + " Total: " + total + " Correct: " + right);
     	$progressbar.attr("value", answered);
     }

   $.getJSON('../json/quiz' + moduleNo +'.json')
     .done(function(data){
	    var currentQuestion;
	    var quizOver;
	    var quiz = [];
      var pool;

     	function quizInit(){
     		resetQuizCard();

        for (section in data){
          pool = [];
          Array.prototype.push.apply(pool, data[section].questions);

          randomize.shuffle(pool);

          for (var i = 0; i < data[section].len;i++){
             quiz.push(pool.pop());

          }
        }
        console.log(quiz);

       		score = 0;
       		answered = 0
       		perfectScore = quiz.length;
       		$progressbar.attr("max", perfectScore);
       		updateProgress(answered, perfectScore, score);
	    	currentQuestion = quiz.pop();
	    	quizOver = false;
	        $next.attr("disabled", true);
	   		ask(currentQuestion);
				mathJax.reload(quizcard);

   		}

  		quizInit();


        $next.on('click', function(){
       	if (quiz.length !== 0){
			   	var currentQuestion = quiz.pop();
			   	ask(currentQuestion);
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

},{"./mods/alert.js":2,"./mods/mathjax.js":3,"./mods/randomize.js":4}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}]},{},[1]);

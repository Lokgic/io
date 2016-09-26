
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
   		var question = '<p class = "lead">Prove the following, and then evaluate your derivation by comparing it to the model answer. DO NOT use derived rules or rules of replament unless the problem is marked with a "*". <button class="btn btn-sm btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">See Model Answer</button></p>';
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
		    	makeAlert($main, "a","Nice job. Remember to check with Lok if you are not sure",1);
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

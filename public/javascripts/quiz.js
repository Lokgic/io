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

	function resetQuizCard(){
			$main.removeClass("card-danger");
		   	$main.removeClass("card-success");
		   	$alertdiv.html("");
	}


	function alertMaker(code, content){
		if ($alertdiv.html() == "") $alertdiv.html("<div class='alert quizalert'></div>");
		$alert = $('.quizalert')
		if ($alert.hasClass('alert-danger')) $alert.removeClass('alert-danger');
			else if ($alert.hasClass('alert-success')) $alert.removeClass('alert-sucess');
			else if ($alert.hasClass('alert-warning')) $alert.removeClass('alert-warning');
			else if ($alert.hasClass('alert-info')) $alert.removeClass('alert-info');

		var tag;
	    if (code == 1){tag = "success";}
	    else if (code == 2){tag = "info";}
	    else if (code == 3){tag = "warning"}
	    else{tag = "danger"}

	    $alert.addClass("alert alert-" + tag +" alert-dismissible fade in");
	            $alert.attr('role', 'alert');
	            var html = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + content + '</div>';
	            $alert.html(html);
	  }

	function shuffle(arr){
		var currentI = arr.length, tempValue, randomI;

		while (0!== currentI){
			randomI = Math.floor(Math.random() * currentI);
			currentI -= 1;

			tempValue = arr[currentI];
			arr[currentI] = arr[randomI];
			arr[randomI] = tempValue;
		}

		return arr;
	}

	function printAnswers(arr){
		$answerList.html("");
		for (var i = 0; i <arr.length; i++){
			
			var htmlHead = '<li class="list-group-item"><button type="button" class="btn btn-primary  choice" value = "' + arr[i] + '">' + (i + 1) + '</button>' + arr[i]+'</li>';
			$answerList.append(htmlHead);
		}

		
	}

	function askQuestion(q){
		var answers = [];

    	Array.prototype.push.apply(answers, q.fake); //get around answers arrary not being empty when quiz restarts
   		answers.push(q.real);
   		shuffle(answers);       
   		$question.html('<p class = "lead">'  + q.question + '</p>');		
   		printAnswers(answers);

   		$(".choice").on("click", function(e){
			e.preventDefault();
			$(".choice").attr("disabled", true)

	   		var chosen = $(e.target).val();


	   		if (chosen !== q.real){
		    	alertMaker(4,"Opps, that was wrong.")
		    	$main.addClass("card-danger");
		    	$next.attr("disabled", false);
		    	answered++;
		    	updateProgress(answered, perfectScore, score);
		    	
		    } else {
		    	alertMaker(1,"That's correct!")
		    	$main.addClass("card-success");
		    	$next.attr("disabled", false);
		    	score += 1;
				answered++;
		    	updateProgress(answered, perfectScore, score);
		    }

	    	
       });
    }
    function updateProgress(answered, total, right){
     	$progresscap.html("Answered: " + answered + " Total: " + total + " Correct: " + right);
     	$progressbar.attr("value", answered);

     }
   $.getJSON('json/quiz' + moduleNo +'.json') 
     .done(function(data){
     	
	    var currentQuestion;
	    var quizOver;
	    var quiz;
     	function quizInit(){
     		resetQuizCard();
       		quiz = shuffle(Object.keys(data).map(function(value) {
							         return data[value]}));
       		score = 0;
       		answered = 0
       		perfectScore = quiz.length;
       		$progressbar.attr("max", perfectScore);
       		updateProgress(answered, perfectScore, score);
	    	currentQuestion = quiz.pop();
	    	quizOver = false;
	        $next.attr("disabled", true);
	        askQuestion(currentQuestion);
   		}
  		quizInit();
       $next.on('click', function(){
       	if (quiz.length !== 0){
		   	var currentQuestion = quiz.pop();
		   	askQuestion(currentQuestion);
		   	$next.attr("disabled", true);
		   	resetQuizCard();
		   } else{
		   	if (quizOver == false){
		   		resetQuizCard();
		   		scoring(score,perfectScore);
		   		quizOver = true;
		   		alertMaker(3, "Press Continue to restart the quiz.")
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
		   		alertMaker(3, "Press 'Continue' to restart the quiz.")
		   	}
    }
       



     }).fail(function(){$question.html('<p> Failed to Load Quiz</p>')});
  	
})

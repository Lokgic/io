$(function() {

	var $question = $('#question');
	var $submit = $('#submit');
	var $answerList = $('#answers');
	var $next = $('#next');
	var $main = $('#quizcard');
	var $header = $('#quizheader');
	var $choice = $('.choice');
	var score;

	var moduleNo = $("title").attr('id');
	var quizId = "m" + moduleNo + "quiz";
	function resetQuizCard(){
			$main.removeClass("card-danger");
		   	$main.removeClass("card-success");
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
			
			var htmlHead = '<button type="button" class="btn btn-primary  btn-block choice" value = "' + arr[i] + '">' + arr[i] + '</button>';
			$answerList.append(htmlHead);
		}

		
	}

	function askQuestion(q){
		var answers = [];

    	Array.prototype.push.apply(answers, q.fake); //get around answers arrary not being empty when quiz restarts
   		answers.push(q.real);
   		shuffle(answers);       
   		$question.html('<p>'  + q.question + '</p>');		
   		printAnswers(answers);

   		$(".choice").on("click", function(e){
			e.preventDefault();
			$(".choice").attr("disabled", true)
	   		var chosen = e.target.innerText;

	   		if (chosen !== q.real){
		    	$header.html("WRONG!")
		    	$main.addClass("card-danger");
		    	$next.attr("disabled", false);
		    	
		    } else {$header.html("Correct!")
		    	$main.addClass("card-success");
		    	$next.attr("disabled", false);
		    	score += 1;

		    }

	    	
       });
    }

   $.getJSON('json/quiz' + moduleNo +'.json') 
     .done(function(data){
     	var perfectScore;
	    var currentQuestion;
	    var quizOver;
	    var quiz;
     	function quizInit(){
     		resetQuizCard();
       		quiz = shuffle(Object.keys(data).map(function(value) {
							         return data[value]}));
       		score = 0;
       		perfectScore = quiz.length;
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
		   	} else{
		   		// restart quiz
		   		quizInit()
		   	}
		   	
		   }
       }); 



    function scoring(actualScore, perfectScore){
    	$question.html("Your score is " + actualScore +"/" + perfectScore+". ");
    	$answerList.html("");
    	$header.html("Result");
    	if(actualScore===perfectScore){
			   	$question.append("You passed! Press continue to review the quiz.");
			   	// Generate answers? Maybe
			   	jQuery.post("/report", {passed: true, quiz: quizId}, function(res){
			   		$question.append('<p>'+res[1]+'</p>');
		   		});
		   	}else {
		   		$question.append("Unfortunately, you didn't pass! Press continue to restart the quiz.");
		   	}
    }
       



     }).fail(function(){$question.html('<p> Failed to Load Quiz</p>')});
  	
})

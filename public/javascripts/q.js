
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
			var possibleAns = randomize.shuffle(obj.possibleAnswers);
    	//create list of possibilities
			var dropdownItems;

			dropdownItems += '<option>Answer</option>';

        for (var i = 0; i < possibleAns.length; i++){
          dropdownItems += '<option value ="'+possibleAns[i]+'">' + possibleAns[i] + '</option>';
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

$(function() {
  // ajax var
  var $alert = $('#alert');
	var $panel = $('#reading');
	var $card = $('#readingcard');
	var $header =$('#readingheader');
	var $block = $('#readingblock');
	var score;
	var moduleNo = $("title").attr('id');
	var $submit = $("#submit");
  

  // html variable for convenience
  var quizId = "m" + moduleNo + "reading";
	var buttonGroupPrior ='<div class="btn-group" data-toggle="buttons">'
	var endDiv = '</div>'
	var buttonPrior1 = '<label class="btn btn-outline-primary"> <input type="radio" name="options" id=';
	var buttonPrior2 = 'autocomplete="off">';
	var buttonPost = '</label>'

  // status
  var reset = false;

  function alertMaker(code, content){
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



  	function makeQCard(n, q, allDfs){
  		var html = '<div class="card" id =QCard'+ n + '><h1 class="card-header display-4">' + (n+1) + '.' + q.term +  '</h1><div class="card-block qcard">';
      // <div class="list-group">'

      html += '<div class="btn-group-vertical definitions" data-toggle="buttons">'; 
		 var answers = [];
     answers.push(q.df);
     while (answers.length<5){
         var temp = allDfs[Math.floor(Math.random()* allDfs.length)];
         var contained = false;
         for (var i = 0; i < answers.length; i++){
          if (temp === answers[i]) contained = true;
         }
         if (!contained){
          answers.push(temp);
         }
     }
    	// Array.prototype.push.apply(answers, q.fake); //get around answers arrary not being empty when quiz restarts
   		// answers.push(q.real);
   		 shuffle(answers); 
   	
   		 // html += '<button type="button" class="list-group-item list-group-item-action" value=' +answers[i] + '">' + answers[i] + '</button>';
    for (var i = 0; i < answers.length; i++){
       html += '<label class="btn btn-outline-primary btn-sm definition"><input type="radio" name="options" id="option1" autocomplete="off" value ="' + answers[i] +'">' + answers[i] + "</label>"
      }
      html += '</div>'
  		return html;
  	}

  	function checkAnswer(quiz){
  		score = 0;
  		for (var i = 0; i<quiz.length;i++){
  			var currentQCard = "#QCard"+(i);
  			var chosen = $("label.btn.active", currentQCard).children().val();
  			if (chosen === quiz[i].df){
  				$(currentQCard).addClass('card-success');
  				score++;
  			} else{
  				$(currentQCard).addClass('card-danger');
  			}
  		}
  		if (score != quiz.length){
  			$submit.html("Reset quiz");
  			$submit.removeClass('btn-primary');
  			$submit.addClass('btn-warning')
        
        alertMaker(4, "You got " + score +" out of "+ quiz.length + ". Try again?");
        reset = true;
  		} else{
  			$submit.html("Success!");
  			$submit.removeClass('btn-primary');
  			$submit.addClass('btn-success')
        $submit.attr("disabled", true);
  			jQuery.post("/report", {passed: true, quiz: quizId}, function(res){
	
          alertMaker(res[0], res[1]);
		   		});
  		}
  	}

   // $.getJSON('json/quiz' + moduleNo +'.json') 
   //   .done(function(data){
   //     var quiz = Object.keys(data).map(function(value) {
			// 				         return data[value]});

   //     for (var i = 0; i<quiz.length;i++){
   //     $panel.append(makeQCard(quiz[i],i))

   //     $submit.on('click', function(e){
   //      e.preventDefault();
   //      e.stopImmediatePropagation();
   //     	checkAnswer(quiz);
   //     });
   //     }
   //   }).fail(function(){console.log('Failed to Load Quiz')});

    function makeReadingQuiz(callback){
        $.getJSON('json/readingquiz' + moduleNo +'.json') 
        .done(function(data){
        callback(null, data);
     }).fail(function(){console.log('Failed to Load Quiz')});
      
    }
    function resetReadingQuiz(n){
        reset = false;
        instruction();
        $submit.addClass('btn-primary');
        $submit.removeClass('btn-warning')
        $submit.html("Submit for Grading");
        // $alert.html("");
        for (var i = 0; i<n;i++){
          var $target = $("#QCard"+i);
          $target.removeClass("card-danger");
          $target.removeClass("card-success")
        }
      }

    function instruction(){
      $alert.removeClass();
      alertMaker(3, 'Answer the reading questions below. Once you are finished, press the submit button for grading. Make sure you are logged in to get credit.');
    }
    //init
    makeReadingQuiz(function(err, data){
      instruction();
      var quiz = Object.keys(data).map(function(value) {return data[value]});
      var allDfs =[];
      for (var i = 0; i < quiz.length; i++){
        allDfs.push(quiz[i].df);
      }
      for (var i = 0; i<quiz.length;i++){
          $panel.append(makeQCard(i,quiz[i],allDfs))
            }
      $submit.on('click', function(e){
          if (reset == false){
            checkAnswer(quiz);
          } else{
            resetReadingQuiz(quiz.length);
          }
       });
    })


})
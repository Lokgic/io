$(function() {
  init("concepts");
  init("reading");
})
  // ajax var
function init(type){

  var $alertdiv = $('#' + type  + 'alertdiv');
  var $alert = $('.' + type  + 'alert');
	var $panel = $('#' + type);
	var $card = $('#' + type  + 'card');
	var $header =$('#' + type  + 'header');
	var $block = $('#' + type  + 'block');
	var score;
	var moduleNo = $("title").attr('id');
	var $submit = $("#" +type + "submit");
  



  // status
  var reset = false;

  function alertMaker(code, content){
    if ($alertdiv.html() == "") $alertdiv.html("<div class='alert " + type + "alert'></div>");
    $alert = $('.'+type+'alert');
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



  	function makeConceptsCard(n, q, allDfs){
  		var html = '<div class="card" id ='+type+'QCard'+ n + '><h1 class="card-header display-4">' + q.term +  '</h1><div class="card-block qcard">';


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

   		 shuffle(answers); 
   	
   		
    for (var i = 0; i < answers.length; i++){
       html += '<label class="btn btn-outline-primary btn-sm definition"><input type="radio" name="options" id="option1" autocomplete="off" value ="' + answers[i] +'">' + answers[i] + "</label>"
      }
      html += '</div>'
  		return html;
  	}

  	function checkAnswer(quiz){
  		score = 0;
  		for (var i = 0; i<quiz.length;i++){
  			var currentQCard = "#" + type + "QCard"+(i);
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
  			jQuery.post("/report", {passed: true, type: type, moduleNo: moduleNo}, function(res){
	
          alertMaker(res[0], res[1]);
		   		});
  		}
  	}


    function loadJSON(callback){
        $.getJSON('json/' + type + moduleNo +'.json') 
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
          var $target = $("#"+type +"QCard"+i);
          $target.removeClass("card-danger");
          $target.removeClass("card-success")
        }
      }

    function instruction(){
      $alert.removeClass();
      alertMaker(3, 'Finish the reading quizzes below in order to complete this module. Once you are finished, press the submit button for grading. Make sure you are logged in to get credit. They are infinitely repeatable, and there is no penalty for failing.');
    }


    function makefillCard(obj){
      var html = '<div class="card" id ="'+ obj.id + '"><h1 class="card-header display-4">' + obj.section +". " + obj.title +  '</h1><div class="card-block fillcard">';
      html += '<p class="font-italic">' + obj.instruction +'<p>';
      html += '<form>';
      for (var i = 0;i<obj.questions.length;i++){
        
        html += '<div class="form-group">';
        html += '<label id = "'+ obj.id +i+'label" for="'+ obj.id +i+'">' + obj.questions[i][0]+'</label>';
        html +=  '<input type="text" class="form-control" id="'+ obj.id+i+'" placeholder="Type answer here"></div>';
      }



      html += '</form>';

      html +='<button class="btn btn-primary btn-lg btn-block m-t-1 m-b-1" id=' + obj.id +  'submit type="button">Submit</button>'

      return html;
    }

    function makeDropdownCard(obj){

        var dropdownItems;
        for (var i = 0; i < obj.possibleAnswers.length; i++){
          dropdownItems += '<option value ='+obj.possibleAnswers[i]+'>' + obj.possibleAnswers[i] + '</option>';
        }

        var html = '<div class="card" id ="'+ obj.id + '"><h1 class="card-header display-4">' + obj.section +". " + obj.title +  '</h1><div class="p-x-2 card-block dropdowncard">';
        html += '<p class="font-italic">' + obj.instruction +'<p>';
      html += '<form>';
         
         for (var i = 0;i<obj.questions.length;i++){
          var tempLabel = obj.id + i; 
           html += '<div class="form-group row">';
            html += '<label id = ' + tempLabel +'label class="col-md-10 col-form-label col-xs-12" for = ' + tempLabel + '>' + obj.questions[i][0] + '</label>'
           html+= '<div class= "col-md-4 col-xs-12"><select class="form-control" id ='+ tempLabel +'>';
           html += dropdownItems;
           html += '</select></div></div>'

         }

         html += '</form>';

      html +='<button class="btn btn-primary btn-lg btn-block m-t-1 m-b-1" id=' + obj.id +  'submit type="button">Submit</button>'

         return html;
      }

    function checkReadingAnswer(obj){
      var selectorTag;
      if (obj.method == "dropdown") selectorTag = " option:selected";
      else if (obj.method == "fill") selectorTag = "";
      var correct =[];
      for (var i = 0; i < obj.questions.length;i++){
        var $targetLabel = $("#" +obj.id + i +"label");
        var $targetInput = $("#" + obj.id + i+ selectorTag);
        if ($targetInput.val().toLowerCase() == obj.questions[i][1].toLowerCase()){
          correct.push(i);
          $targetLabel.html(obj.questions[i][0] + " &#10004;");
        } else $targetLabel.html(obj.questions[i][0] + " &#10008;");
      }
      if (correct.length == obj.questions.length) return true;
        else return false;
    }

    
    function makeAlert(location, direction, text, code){ //direction: a= above, b=below
      /////This takes care of the HTML
      var tag;
      if (code == 1){tag = "alert-success";}
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

      


 
    

    //init
      loadJSON(function(err, data){
        instruction();
        var makeQuestionType = {};
        var checkQuestionType = {};
        makeQuestionType.fill = makefillCard;
        makeQuestionType.dropdown = makeDropdownCard;
        

        if(type =="reading"){
  
           for (problem in data){
  

              $panel.append(makeQuestionType[data[problem].method](data[problem]));


                monitorButton(data[problem]);
          
           }
        }

        function monitorButton(problemObject){

              $('#' + problemObject.id + 'submit').on('click', function(e){

                if (checkReadingAnswer(problemObject)){

                    jQuery.post("/report", {label: problemObject.label, moduleNo: problemObject.moduleNo}, function(res){
                            makeAlert($('#' + problemObject.id + 'submit'), "a", "You have completed this section! " + res,2);

                         });
        }else {
                  makeAlert(this, "a", "Incorrect answers are marked by &#10008;. Fix them and press this button to submit again.",4)

                }
    })
            }




        if(type == "concepts"){
          var quiz = Object.keys(data).map(function(value) {return data[value]});
          var allDfs =[];
          for (var i = 0; i < quiz.length; i++){
            allDfs.push(quiz[i].df);
          }
          var picked =[]
          while(picked.length < 10) {
              var temp = Math.floor(Math.random()*quiz.length);
                if (picked.indexOf(temp) === -1){
                  picked.push(temp);
                  $panel.append(makeConceptsCard(temp,quiz[temp],allDfs));
                }
          }


              
          $submit.on('click', function(e){
              if (reset == false){
                $alertdiv.html("");
                checkAnswer(quiz);
              } else{
                $alertdiv.html("");
                resetReadingQuiz(quiz.length);
              }
           });

        }
      })
   

   

}
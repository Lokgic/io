var makeAlert = require('./mods/alert.js')
var randomize = require('./mods/randomize.js')
var mathJax = require('./mods/mathjax.js')
var makeCard = {};
makeCard["fill"] = require('./mods/makefillcard.js')
makeCard["dropdown"] = require('./mods/makedropdowncard.js')
makeCard["game"] = require('./mods/makegamecard.js')
var conceptsquiz = {
  ConceptsQuiz: ConceptsQuiz,
  checkConceptsAnswers:checkConceptsAnswers,
  resetConceptsQuiz: resetConceptsQuiz
}

var instruction = function(){
   makeAlert($('#conceptscard'), 'b', 'Define the terms given below. Once you are finished, press the submit button for grading. Make sure you are logged in to get credit. They are infinitely repeatable, and there is no penalty for failing.',3);

}

// global var
var moduleNo = $("title").attr('id');
var conceptsReset = false;

$(function() {
  init("concepts");
})



var printConceptsInfo =   function(header, body, data) {


        var terms = '<table class="table table-inverse table-hover table-bordered table-striped"><tbody>';
        var count = 0;
        for (key in data){
            if (count === 0){
                terms += '<tr>';
                
            } 
            terms += "<td> "+ data[key].term + '</td>';
            count++;
            if (count === 3){
                terms += '</tr>'
                count = 0;
            }

        }
        for (var i = 0; i < 3 - count; i++){
            terms+= '<td></td>'
        }
        terms += '</tbody>'
        body.append('<p>For conceptual quiz, you will quizzed on the terms below. All definitions are taken directly from the text.</p>' + terms);
       
       
    }

var ConceptsQuiz = function ConceptsQuiz(n, q, allDfs){
  var html = '<div class="card" id = conceptsQCard'+ n + '><h1 class="card-header display-4">' + q.term +  '</h1><div class="card-block qcard">';


  html += '<div class="btn-group-vertical definitions" data-toggle="buttons">'; 
 var answers = [];
 answers.push(q.df);  //makes 5 answer. push the right answer first
 while (answers.length<5){ //add 4 other random answers from allDfs
     var temp = allDfs[Math.floor(Math.random()* allDfs.length)];
     var contained = false;
     for (var i = 0; i < answers.length; i++){
      if (temp === answers[i]) contained = true;
     }
     if (!contained){
      answers.push(temp);
     }
 }

   randomize.shuffle(answers); //mix'em up

    //make buttons
  for (var i = 0; i < answers.length; i++){
     html += '<label class="btn btn-outline-primary btn-sm definition"><input type="radio" name="options" id="option1" autocomplete="off" value ="' + answers[i] +'">' + answers[i] + "</label>"
    }
    html += '</div>'
    return html;
  }

var checkConceptsAnswers = function checkConceptsAnswers(quiz){
  var $submit = $('#conceptssubmit');
  var type = "concepts";
  score = 0;
  for (var i = 0; i<quiz.length;i++){
    var currentQCard = "#conceptsQCard"+(i);
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
    
    makeAlert($('#conceptscard'),'b' , "You got " + score +" out of "+ quiz.length + ". Press 'Reset' to retry", 4);
    conceptsReset = true;
  } else{
    $submit.html("Success!");
    $submit.removeClass('btn-primary');
    $submit.addClass('btn-success')
    $submit.attr("disabled", true);
    jQuery.post("/report", {passed: true, label: type, moduleNo: moduleNo}, function(res){

       makeAlert($('#conceptscard'),'b' , res, 1);
      });
  }
}

var resetConceptsQuiz = function resetConceptsQuiz(n){
  var $submit = $('#conceptssubmit');
  var type = "concepts";
    conceptsReset = false;
    $submit.addClass('btn-primary');
    $submit.removeClass('btn-warning')
    $submit.html("Submit for Grading");
    instruction();
    // $alert.html("");
    for (var i = 0; i<n;i++){
      var $target = $("#"+type +"QCard"+i);
      $target.removeClass("card-danger");
      $target.removeClass("card-success")
    }
  }

var conceptsquiz = {
  ConceptsQuiz: ConceptsQuiz,
  checkConceptsAnswers:checkConceptsAnswers,
  resetConceptsQuiz: resetConceptsQuiz
}





      
//used load json, embed the quiz initiation in the callback
    function loadJSON(type, callback){
        $.getJSON('../json/' + type + moduleNo +'.json') 
        .done(function(data){
        callback(null, data);
     }).fail(function(){console.log('Failed to Load Quiz')});
      


    }
//create button that track the problem. needed to have multiple buttons
function monitorButton(problemObject){
      $('#' + problemObject.id + 'submit').on('click', function(e){
        if (checkReadingAnswer(problemObject)){
            jQuery.post("/report", {label: problemObject.label, moduleNo: problemObject.moduleNo}, function(res){
                    makeAlert($('#' + problemObject.id + 'submit'), "a", "You have completed this section! " + res,2);
                 });
        }else {
                  makeAlert(this, "a", "Incorrect answers are marked by &#10008;. Fix them and press this button to submit again.",4)
                   
                }
        mathJax.reload(problemObject.id + "card"); 
        })
}




function init(type){
  //html elements are attached according to the type of quiz
  var $alertdiv = $('#' + type  + 'alertdiv');
  var $alert = $('.' + type  + 'alert');
	var $panel = $('#' + type);
	var $card = $('#' + type  + 'card');
	var $header =$('#' + type  + 'header');
	var $block = $('#' + type  + 'block');
	var score;
	var $submit = $("#" +type + "submit");
  

    //loadJSON rest of method exists within
      loadJSON(type, function(err, data){

        printConceptsInfo($header,$block,data)

        
       instruction();



        if(type == "concepts"){
          var quiz = Object.keys(data).map(function(value) {return data[value]});
          var allDfs =[];
          for (var i = 0; i < quiz.length; i++){
            allDfs.push(quiz[i].df);
          }
          var picked =[]
          while(picked.length < quiz.length) {
              var temp = Math.floor(Math.random()*quiz.length);
                if (picked.indexOf(temp) === -1){
                  picked.push(temp);
                  $panel.append(conceptsquiz.ConceptsQuiz(temp,quiz[temp],allDfs));
                
                }
          }
         


              
          $submit.on('click', function(e){
              if (conceptsReset == false){
                $alertdiv.html("");
                conceptsquiz.checkConceptsAnswers(quiz);
              } else{
                $alertdiv.html("");
                conceptsquiz.resetConceptsQuiz(quiz.length);
              }
           });

        }
      })
   

   

}
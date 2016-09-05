// global var
var moduleNo = $("title").attr('id');
var conceptsReset = false;

$(function() {
  init("concepts");
  init("reading");
})


var mathJax ={
  load: function () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
  document.getElementsByTagName("head")[0].appendChild(script);
  },
  reload: function(id){
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,id]);

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
    }


  }

  //Shuffle Array
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


//generate concepts quizzing cards. n is the index of the solution in AllDfs, which includes just terms, but indexes preversed. q is the question term. return html
function makeConceptsCard(n, q, allDfs){
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

   shuffle(answers); //mix'em up

    //make buttons
  for (var i = 0; i < answers.length; i++){
     html += '<label class="btn btn-outline-primary btn-sm definition"><input type="radio" name="options" id="option1" autocomplete="off" value ="' + answers[i] +'">' + answers[i] + "</label>"
    }
    html += '</div>'
    return html;
  }

//check multiple answer on one page, works for concepts
function checkConceptsAnswers(quiz){
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


//clear all color and reset the button
function resetConceptsQuiz(n){
  var $submit = $('#conceptssubmit');
  var type = "concepts";
    conceptsReset = false;
    instruction("concepts");
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

  // run at this beginning of page, uses new alertmaker
function instruction(type){

  if (type == "reading"){
    var location = $('#readingcard');
  makeAlert(location, "b",'Finish the reading quizzes below in order to complete this module. Once you are finished, press the submit button for grading. Make sure you are logged in to get credit. They are infinitely repeatable, and there is no penalty for failing.', 3);
  } else if (type == "concepts"){
    var location = $('#conceptscard');
    makeAlert(location, 'b', 'Define the terms given below. Once you are finished, press the submit button for grading. Make sure you are logged in to get credit. They are infinitely repeatable, and there is no penalty for failing.',3);
  }
}



//make fill in the bank card, put ids on elements. return html
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


//make fill in the bank card, put ids on elements. return html
function makeDropdownCard(obj){
  dropdownItems += '<option>Answer</option>';
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

//method agnostic - if drop down it jus goes add selected tag to find picked item.
function checkReadingAnswer(obj){
  var selectorTag;
  if (obj.method == "dropdown") selectorTag = " option:selected";
  else if (obj.method == "fill") selectorTag = "";
  var correct =[];
  for (var i = 0; i < obj.questions.length;i++){
    var $targetLabel = $("#" +obj.id + i +"label");
    var $targetInput = $("#" + obj.id + i+ selectorTag);
    if ($targetInput.val().toLowerCase().trim() == obj.questions[i][1].toLowerCase().trim()){
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
        })
}

function makeTable(x,y, id){
  var tableHTML = '<table class="table truthtable"><tbody>';
  for (var i=0;i<x;i++){
    tableHTML += '<tr>';
    for (var j = 0; j<y; j++){
      tableHTML += '<td id=x'+i + 'y' +j +id+'></td>';
    }
    tableHTML+= "</tr>"
  }
  tableHTML+='</tbody></table>'
  return tableHTML;
}

function fillTable(type, id){
  $('#x0y0'+id).html('A');
  $('#x0y1'+id).html('B');
  symbol = {};
  symbol.conditional = '\\to';
  symbol.disjunction = '\\vee';
  symbol.conjunction =  '\\wedge';
  symbol.biconditional = '\\leftrightarrow';
   $('#x0y2'+id).html('??');
  var atomic = [['T', 'T'],
                ['T', 'F'],
                ['F', 'T'],
                ['F', 'F']
                      ];
  truthValues = {};
  truthValues.conditional = ['T','F','T','T'];
  truthValues.conjunction = ['T','F','F','F'];
  truthValues.disjunction = ['T','T', 'T', 'F'];
  truthValues.biconditional = ['T', 'F', 'F', 'T'];



    for (var x = 0; x<  atomic.length;x++){
      for (var y = 0; y<  atomic[0].length; y++ ){
        $('#x'+(x+1) +'y'+y+id).html(atomic[x][y]);
      }
    }

  for (var x = 0; x <truthValues[type].length;x++){
    $('#x'+(x+1) +'y2'+id).html(truthValues[type][x])
  }
}

function truthTableInterpretation(type){
    score = 0;
  var tableId = "truthTable";
  var $panel = $('#' + type);
  var connectives = ['conditional','disjunction','conjunction','biconditional'];
  var connectivesP = [0.4,0.6,.8,1];
  var cardHTML = '<div class="card" id ="truthTableInterpretationCard"><h1 class="card-header display-4">Truth Table Interpretation</h1><div class="p-x-2 card-block" id = "truthTableInterpretationBlock"></div></div>';
 
  $panel.append(cardHTML);
  var choose = randomize.chooceProbabilistically(connectives, connectivesP);
  function setupProblem(){
    $('#truthTableInterpretationBlock').html(makeTable(5,3,tableId));
    fillTable(choose, tableId);
    var buttonHTML = '<div class="btn-group" role="group" aria-label="TruthTableAnswer">';
    buttonHTML +='<button type="button" class="btn btn-secondary TTbutton" value = "conditional"> \\(A \\to B \\)</button>';
    buttonHTML +='<button type="button" class="btn btn-secondary TTbutton" value = "disjunction"> \\(A \\vee B \\)</button>';
    buttonHTML +='<button type="button" class="btn btn-secondary TTbutton" value = "conjunction"> \\(A \\wedge B \\)</button>';
    buttonHTML +='<button type="button" class="btn btn-secondary TTbutton" value = "biconditional"> \\(A \\leftrightarrow B \\)</button>';
    buttonHTML += '</div>';
    $('#truthTableInterpretationBlock').append(buttonHTML);
    mathJax.reload("truthTableInterpretationBlock");
    }
   setupProblem();
  $('.TTbutton').on('click', function(e){
    var answer = $(e.currentTarget).val();
    if (answer == choose){
      score+=1;
      console.log(score);
    } else{
      console.log("you suck")
    }
    choose = randomize.chooceProbabilistically(connectives, connectivesP);
    setupProblem();
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
        instruction(type);
        var makeQuestionType = {};
        var checkQuestionType = {};
        makeQuestionType.fill = makefillCard;
        makeQuestionType.dropdown = makeDropdownCard;
        

        if(type =="reading"){
  
           for (problem in data){

              if (data[problem].method == "activity"){
                truthTableInterpretation(type);
              }
              else{
              $panel.append(makeQuestionType[data[problem].method](data[problem]));
                monitorButton(data[problem]);  
                }        
           }
        }






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
                  $panel.append(makeConceptsCard(temp,quiz[temp],allDfs));
                }
          }


              
          $submit.on('click', function(e){
              if (conceptsReset == false){
                $alertdiv.html("");
                checkConceptsAnswers(quiz);
              } else{
                $alertdiv.html("");
                resetConceptsQuiz(quiz.length);
              }
           });

        }
      })
   

   

}
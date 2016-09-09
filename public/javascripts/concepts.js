(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./mods/alert.js":2,"./mods/makedropdowncard.js":3,"./mods/makefillcard.js":4,"./mods/makegamecard.js":5,"./mods/mathjax.js":6,"./mods/randomize.js":7}],2:[function(require,module,exports){
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
var makeDropdownCard =  function makeDropdownCard(obj){
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


module.exports = makeDropdownCard;
},{}],4:[function(require,module,exports){
var makefillCard = function makefillCard(obj){
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


module.exports = makefillCard;
},{}],5:[function(require,module,exports){
var makeGameCard = function makeGameCard(obj){
   var html = '<div class="card" id ="'+ obj.id + '"><h1 class="card-header display-4">' + obj.section +". " + obj.title +  '</h1><div class="p-x-2 card-block dropdowncard">';
    html += '<p class="font-italic">' + obj.instruction +'<p>';
    html += '<a class="btn btn-primary" href="../2/wason" role="button">Link</a>';
    html += '</div>'
    return html;
}





module.exports = makeGameCard;
},{}],6:[function(require,module,exports){
var mathJax = {
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



module.exports = mathJax;
},{}],7:[function(require,module,exports){
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

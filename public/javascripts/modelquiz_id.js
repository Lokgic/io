(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function() {

    var debug = false;

    //////Modules

    var makeAlert = require('./mods/alert.js')
    var mathjax = require('./mods/mathjax.js')
    mathjax.reload();


    var newDifficulty = false;
//Module specific settings
    var di;

    //States initialization
    var score = 0;
    var toPass = 15;
    var buttNextState = "checkAnswer";
    var currentProblem

    function loadModel(callback){
      jQuery.post("../processing/model_id")
      .done(function(data){
          callback(null, data);
      }).fail(function(){$body.append('Failed to Load Quiz')})
    };

    loadModel(function(err, data){
      console.log(data)
      currentProblem = initTable(data)
    })

    function initTable(data) {


            $('#ud0').text('{' + data.model.ud + '}')


            html = "";
            for (p in data.model.extensions) {
                html += data.model.extensions[p].string
            }

            $('#ext0').html(html)
            htmlr =""
            for (r in data.model.referents){
              htmlr +="<p>"+ data.model.referents[r].name + ": " + data.model.referents[r].referent + "</p>"
            }
            console.log(htmlr)
            $('#ref0').html(htmlr)



          var toReturn = []
        for (var i = 0; i<data.statements.length;i++){
          toReturn.push(data.statements[i][1])
          $('#statement'+i).text("\\(" + data.statements[i][0].string +"\\)");
        }
        // console.log(props)

        mathjax.reload("table");

        console.log(toReturn)

        return toReturn;


    }






    function getTableValues(ans) {

        var last = $('.tbutt').last().attr("id").split("-");
        var truthValues = [];
        for (var i = 0; i <= last[0]; i++) {
            var temp = []
            for (var j = 0; j <= last[1]; j++) {
                temp[j] = $("#" + i + "-" + j).attr("value")
                $("#" + i + "-" + j).removeClass("true");
                $("#" + i + "-" + j).removeClass("false");
                if (temp[j] == ans[i][j]) toAdd = 'correct'
                else if (temp[j] == undefined || temp[j] == "") toAdd = 'missing'
                else toAdd = 'wrong'
                $("#" + i + "-" + j).addClass(toAdd)
            }
            truthValues[i] = temp;
        }
        if (debug){
          console.log("input: " + truthValues);
          console.log("answer is " + ans)
          console.log("returning " + _.isEqual(truthValues,ans))
        }
        return _.isEqual(truthValues,ans);



    }


    function resetTable(){
      makeAlert($('.jumbotron'), "b","",0)
      var last = $('.tbutt').last().attr("id").split("-");

      for (var i = 0; i <= last[0]; i++) {
          for (var j = 0; j <= last[1]; j++) {
              $temp = $("#" + i + "-" + j)
              $temp.attr('value',"")
              $temp.removeClass("correct");
              $temp.removeClass("wrong");
              $temp.removeClass("missing");
              $temp.text("?")
          }
      }

    }

    function updateScore(){

      if (newDifficulty) {
        di += 1;
        if (di == 4) variables.push('w');
        newDifficulty = false
      }

      $('#description').text("Difficulty Level: " + di);
      $('#score').text("Score: " + score);
    }

    $('.tbutt').on('click', function() {
      if (buttNextState == 'checkAnswer'){
        if ($(this).text() == "T") {
          $(this).text("F")
          $(this).attr("value", false)
          $(this).addClass("false")
          $(this).removeClass("true")
        } else {
          $(this).text("T")
          $(this).attr("value", true)
          $(this).addClass("true")
          $(this).removeClass("false")
        }
      }
    })






  updateScore();
    var currentAnswers = initTable();
    // console.log(currentAnswers)
    $('button').on('click', function(){

        switch (buttNextState){
        case "checkAnswer":{
          if(getTableValues(currentAnswers)){
            switch (score){
              case (toPass - 1):{
                score += 1;
                buttNextState = "startover";
                jQuery.post("/report", {moduleNo: $('title').attr('value'), label : "quiz"}, function(res){
                makeAlert($('.jumbotron'), "b", "You have passed this quiz! " + res ,1)

              });

                break;
              }
              default:  {
                score += 1;
                if (score == 10 || score == 5) newDifficulty = true;
                buttNextState = "newTable"
                makeAlert($('.jumbotron'), "b", "This is correct! You need solve " + (toPass - score) + " more table(s) to pass this quiz." ,2)
              }
            }
          } else{
            buttNextState = "startover"
            makeAlert($('.jumbotron'), "b", "Unfortunately this isn't quite right! Incorrect answers are marked red, missing answers orange, and correct  answers blue. Press Submit to try again." ,4)
          }
          break;
        }
        case "newTable":{
          resetTable()
          currentAnswers = initTable();
              // console.log(currentAnswers)
          buttNextState ="checkAnswer"
          break;
        }
        case "startover":{
          score = 0;
          resetTable()
          currentAnswers = initTable();
              // console.log(currentAnswers)
          buttNextState ="checkAnswer"
          break;
        }
      }
      updateScore();




///////

    });
})

},{"./mods/alert.js":2,"./mods/mathjax.js":3}],2:[function(require,module,exports){
var makeAlert = function(location, direction, text, code){ //direction: a= above, b=below
  /////This takes care of the HTML
  var tag;
  if (code == 0){
	if (direction == "a"){
        // $(location).prev().html("");
          $(location).prev('.alert').remove();
        }
      if (direction == "b"){
          // $(location).next().html("")
          $(location).next('.alert').remove();
        }

  }else{
    switch(code){
      case 1: tag = "alert-success";
      break;
      case 2: tag = "alert-info";
      break;
      case 3: tag = "alert-warning"
      break;
      case 4: tag = "alert-danger"
    }
    // console.log(tag)
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
    }}

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
  },
  config: function(){
    MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [ ['$','$'], ['\\(','\\)'] ]
    }}
  );
}
}



module.exports = mathJax;

},{}]},{},[1]);

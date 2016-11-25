(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function(){
  var makeAlert = require('./mods/alert.js')
  function checkCheckboxAnswers(moduleNum, exId, data){

      var checked = [];
      var answers = [];
      var right = 0;
      for (var i = 0;i<data.ex[exId].questions.length;i++){
        answers.push(data.ex[exId].questions[i][1]);
        checked.push(document.getElementById(exId+"-"+i).checked);
        if (answers[i] == checked[i]){
          right++;
        }
      }
      // console.log(right +  " " + answers.length)
      if (right != answers.length) return false;
        else return true;
      // return [right, answers.length];


  }

  function loadJSON(id, callback){
          $.getJSON('../json/'+id + '.json')
          .done(function(data){
          callback(null, data);
       }).fail(function(){body.append('Failed to Load Data')});

      }
  $allbutts = $('.readingbutt');

  $allbutts.on('click', function(){
    var location = "#" + $(this).attr("id");
    var target = $(this).val();
    var moduleNum = target.split("-")[0];
    var exId = target.split("-")[1];
    var type = target.split("-")[2];
    console.log(exId)
    loadJSON("lesson" + moduleNum,function(err,data){
      if (type == "check"){
      // console.log(checkCheckboxAnswers(moduleNum,exId,data));
        if (!checkCheckboxAnswers(moduleNum,exId,data)) {
          // console.log(checkCheckboxAnswers(moduleNum,exId,data));
          makeAlert(location, "a", "Unfortunately this is not correct. Fix your answers and submit again",4)
        } else{
          jQuery.post("/report", {label: exId, moduleNo: moduleNum}, function(res){
                  makeAlert($(location), "a", "You have completed this section! " + res,2);
               });
          // makeAlert(location, "a", "right",1)
        }
    }
  })


  })

  // console.log($allbutts)

})

},{"./mods/alert.js":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);

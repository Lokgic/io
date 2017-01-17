(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function(){
  var help = require('./mods/helpers.js')
  var quizDiv = d3.select('#sl-1-1')
  var qId = quizDiv.attr('id')
  var qInfo = qId.split('-')
  var logged = ($('#mainnavbar').attr('data') == "notLogged") ? false : true;
  var uid = $('#mainnavbar').attr('data')
  var width = $('#sl-1-1').width()

  function loadSyl(callback){
    jQuery.post("/processing/syllogism/list")
    .done(function(data){
        callback(null, data);
    }).fail()
  };

    function sylToString(prob){
      return {
        question:["Premise 1: "+prob.p1str, "Premise 2: "+prob.p2str, "Conlucsion: "+ prob.cstr],
        pid:prob.form,
        options: ["Valid", "Invalid"],
        input:null
      }

    }

    loadSyl(function(e,d){
      var problemSet = []
      for (problem in d){
        problemSet.push(sylToString(d[problem]))
      }
      console.log(problemSet)
      quizDiv.select('.readingExQ').selectAll('div')
              .data(problemSet).enter()
              .append('button').attr('class','binaryChoice-orignal').html(function(d){
                var str = d.question[0]+"<br>"+d.question[1]+"<br>"+d.question[2]
                return str
              })
              .on('click',function(d){
                switch (d.input){
                  case null:{
                    d.input = "valid"
                    d3.select(this).attr('class',"binaryChoice-clicked");
                    break;
                  }
                  case "valid":{
                    d.input = "invalid"
                    d3.select(this).attr('class',"binaryChoice-clicked2")
                    break;
                  }
                  case "invalid":{
                    d.input = "valid"
                    d3.select(this).attr('class',"binaryChoice-clicked")
                    break
                  }
                }

              })
    })

    quizDiv.select('.confirmButt').on('click',function(d){
      d3.selectAll('.binaryChoice-clicked').attr('id',function(d){console.log(d)})
    })

})

},{"./mods/helpers.js":2}],2:[function(require,module,exports){
var alert = function(msg, color, location){
  if (location == undefined) location = "bottom right"
      notifyMsg = msg
      notifyOption = {
          style: color,
          position: location
      }

    $.notify(notifyMsg,notifyOption)
    }
var getUid = function(){
  return $('#mainnavbar').attr('data')
}

module.exports.alert = alert;
module.exports.getUid = getUid;

},{}]},{},[1]);

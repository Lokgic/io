(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// var d3 = require("d3");

$(function(){
  jQuery.post("/stat", function(dataset){

      x= 0;
      for (num in dataset){
        x+= dataset[num];
      }
      x = x/dataset.length;
      x = Math.trunc(100*x/(8 * 6))



      var html =' <progress class="progress progress-info progress-striped m-b-3" value="' + x + '" max="100" aria-describedby="percent"></progress>'
     console.log(html);
     $('#averagepercent').html("Class Average: " + x + "%");
     $('#average').html(html);
     var $stdbar = $('#percentbar');
     var student = $stdbar.val();
     if (x - student < -5 ){
       $stdbar.addClass("progress-success");
     } else if (x - student >  10){
       $stdbar.addClass("progress-danger");
     } else if (x - student > 5 ){
       $stdbar.addClass("progress-warning");
     }

       });

//
// function doStuff(dataset){
//   x= 0;
//   for (num in dataset){
//     x+= dataset[num];
//   }
//   dataset.push(x/dataset.length);
//   dataset.push()
//   // d3.select("#main").selectAll("div") .data(dataset) .enter() .append("div") .attr("class", "bar")
//   // .style("height", function(d) {
//   //   return (d/60)*1000 + "px"; });;
//   //   }
//   //
//   // d3.select("#main").selectAll("div") .data(dataset) .enter() .append("progress") .attr("class", "progress")
//   // .attr("value", function(d) {return d/60*100}).attr("max", 100)
//   var w = 500;
//   var h = 100;
//   var svg = d3.select("body") .append("svg") .attr("width", w) .attr("height", h);
// }

  // var scale = d3.scale.linear();
  // scale.domain([0,48]);
  // scale.range([0,100]);
})

},{}]},{},[1]);

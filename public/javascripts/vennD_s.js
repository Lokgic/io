var venn = require("venn.js")
var text1 = "First, consider a circle that contains all plucked intruments and another one that contains all bowed instruments."

var text2 = "Premise 1 tells that whatever instrument Bob plays belongs to the bowed circle. Based on this premise alone, do we have good enough reason to think that Bob does not play the guitar?"

var text3 = "Not quite - since that premise alone does not give us enough information to where guitars would be in this diagram. If, for instance, there are guitars that are both plucked and bowed, then the fact that Bob plays a bowed instrument is not sufficient to rule out the possibility of him playing the guitar."

var text4 =  "This is exactly why the second premise is important: it tells us that guitars are not played with bows. This means that it is impossible for the guitar circle to be inside of the overlapping areas."

var t

// This means that there is no way Bob's choice of instrument would be part of hte guitar circle. In other words, the premises necessitates  that the conclusion: if the premises are true, then the conlucsion has to be true."

$canvas = $('.animation');

var bobLabel,
    bobLine,
    bobText,
    bowed,
    bowedText,
    plucked,
    pluckedtext;
$(function(){
  var frame = [];
  var i = 0
  ScrollTop = 0
$(window).on('scroll',function(){
    newScrollTop = $(window).scrollTop()
    point = $e.position().top + ($e.height()/2) - (window.innerHeight/2)

    startPoint = $canvas.offset().top + $canvas.height() - window.innerHeight

    if (newScrollTop > startPoint && frame[0] != true){
       bowed = svg
                .append("g")
                .append("circle").attr("r",radius).attr("cx",bowedX).attr("cy", bowedY).style('fill', bowedColor).style('opacity', 0)
                .transition().duration(1500).style('opacity', 0.5)
       bowedText = svg.append('text').text('Bowed').attr("dx",bowedX - 40).attr("dy", bowedY).style('fill',bowedColor).style('opacity', 0)
      .transition().duration(1500).style('opacity', 1)
       plucked = svg
                .append("g")
                .append("circle").attr("r",radius).attr("cx",pluckedX).attr("cy", pluckedY).style('fill',pluckedColor).style('opacity', 0)
                .transition().duration(1500).style('opacity', 0.5)
       pluckedText = svg.append("text").text("Plucked").attr("dx",pluckedX - 30).attr("dy", pluckedY).style('fill',pluckedColor).style('opacity', 0)
      .transition().duration(1500).style('opacity', 1)
      frame[i] = true;
      i = 0
    }

    console.log(newScrollTop)
    if (newScrollTop > point && !frame[1]) {
      var ePos = ($e.position())
      $e.css('position','fixed')
        .css('top',  ePos.top - $(window).scrollTop() )
        .css('left',  ePos.left - $(window).scrollLeft())
      frame[1] = true


    }
      if (newScrollTop > tp("#t2") && !frame[2]){

         bobLine = svg.append('g').append('line').attr('class', 'bobLabel')
                        .attr("x1", bobX).attr("y1",bobY).attr("x2", bobX).attr("y2",bobY ).attr("stroke-width", 1).attr("stroke","black")
                        .transition()
                        .duration(1000)
                        .attr("y2", bobY - radius - 30)

          bobLabel = svg.append('text').text("What Bob plays").attr('class', "bobLabel")
                        .attr("dx",bobX - 20).attr("dy", bobY - radius-40).style('opacity',0)
                        .transition()
                        .duration(1000)
                        .style('opacity',80)

         bob = svg
                  .append("g")
                  .append("circle").attr('id', 'bob').attr("r",radius/8).attr("cx",bobX).attr("cy",bobY ).style('fill', bobColor).style('opacity', 0.5)

        frame[2] = true

      }

      if (newScrollTop > tp("#t3") && !frame[3]){

        d3.selectAll('.bobLabel').transition().duration(500).style("opacity",0);
        d3.select('#bob').transition().duration(1000).attr("cx", width/2)

        var guitar = svg
                  .append("g").attr('id','guitarStuff')
                  .append("circle").attr("r",radius/3).attr("cx",width/2).attr("cy", bobY).style('fill',guitarColor).style('opacity', 0.5).attr('id', 'guitar')
        d3.select('#guitarStuff').append("text").text("Guitar").attr("dx",width/2).attr("dy", bobY).style('fill',guitarColor)


        // var guitarText = svg.append("text").text("Guitar").attr("dx",pluckedX - 30).attr("dy", pluckedY).style('fill',pluckedColor)
        //   .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");


        frame[3] = true
      }

      if(newScrollTop > tp('#t4') && !frame[4]){
        d3.select('#guitarStuff').transition().duration(1500).attr("transform",'translate(' + radius + ')')
        frame[4] = true;
      }
    ScrollTop = newScrollTop;



  })

  function tp(id){
    return $(id).offset().top + ($(id).height()/2) - (window.innerHeight/2)
  }

  $e = $('.animation', '#m1c1s1');
  var width = $e.width()
      height = width

      radius = (Math.min(width, height) / 4);

  // var chart = venn.VennDiagram();
  // var sets = [
  //           {sets:["Bob's"], size: 1},
  //           {sets:["Bob's", "Bowed"], size: 1},
  //           {sets: ['Plucked'], size: 12},
  //            {sets: ['Bowed'], size: 12},
  //            {sets: ['Bowed','Plucked'], size: 2}];
  // d3.select(".animation").datum(sets).call(chart);
  d3.select(".text").append('p').text(text1).attr('id', "t1").style("margin-top", 200)
  d3.select(".text").append('p').text(text2).attr('id', "t2")
  d3.select(".text").append('p').text(text3).attr('id', "t3")
  d3.select(".text").append('p').text(text4).attr('id', "t4")







  var svg = d3.select(".animation").append("svg")
    .attr("width", width)
    .attr("height", height)

  var bowedX = width/3
  var bowedY = height/2
  var bowedColor = "#7E8959"
  var pluckedX = 2*width/3
  var pluckedY = height/2
  var pluckedColor = "#C9AC68"
  var guitarX = 2.2*width/3;
  var guitarY = 1.3*height/2
  var guitarColor = "#7E6B71"
  var bobColor = "#B25538"
  var bobX = bowedX/2
  var bobY = bowedY



  // .attr("x1", bobX).attr("y1",bobY).attr("x2", bobX).attr("y2",bobY - radius).attr("stroke-width", 2).attr("stroke","black")
  // var bobLabel = svg.append('text').text("What Bob plays").attr("dx",bobX - 20).attr("dy", bobY - radius-10).style('fill', "black")




  // d3.json("/json/instruments.json", function(error, root){
  //   if (error) throw error;
  //   root = d3.hierarchy(root).sum(function(d) { return 1; })
  //   console.log(root)
  // })

})

var venn = require("venn.js")
var text1 = "We can represent the logical structure of this argument graphically."
var text2 = "First, imagine a circle that contains all plucked intruments and another one that contains all bowed instruments."
var text3 = "Premise 1 tells that whatever instrument Bob plays belongs to the bowed circle."
var text =  "First, imagine a circle that contains all plucked intruments and another one that contains all bowed instruments. Premise 1 tells that whatever instrument Bob plays belongs to the bowed circle. Based on this premise alone, do we have good enough reason to think that Bob does not play the guitar?  Not quite - since that premise alone does not give us enough information to where guitars would be in this diagram. If for instance there are guitars that are both plucked and bowed, then the fact that Bob plays the guitar is not sufficient to rule out the possibility of him playing the guitar. This is exactly what the second premise tells us, that no guitar belongs to the bowed area. This means that there is no way Bob's choice of instrument would be part of hte guitar circle. In other words, the premises necessitates  that the conclusion: if the premises are true, then the conlucsion has to be true."

$(function(){
  var activation = false;
  ScrollTop = 0
$(window).on('scroll',function(){
    newScrollTop = $(window).scrollTop()
    point = $e.position().top + ($e.height()/2) - (window.innerHeight/2)

    // console.log(point)
    if (newScrollTop > point && !activation) {
      var ePos = ($e.position())
      $e.css('position','fixed')
        .css('top',  ePos.top - $(window).scrollTop() )
        .css('left',  ePos.left - $(window).scrollLeft())
      activation = true;


    }
      if (newScrollTop > tp("#t2")){
        var newsets = [ {sets: ['Bowed'], size: 12}];
        d3.select(".animation").datum(newsets).call(chart);
      }

      if (newScrollTop > tp("#t3")){
        var set2 = [{sets: ['Bowed','Bob'], size: 1},
                    {sets: ['Bowed'], size: 12},
                    {sets: ['Bob'], size: 1}
                   ];
        d3.select(".animation").datum(set2).call(chart);
      }
    ScrollTop = newScrollTop;



  })

  function tp(id){
    return $(id).offset().top + ($(id).height()/2) - (window.innerHeight/2)
  }
  var width = 960,
      height = 700,
      radius = (Math.min(width, height) / 2) - 10;
  var chart = venn.VennDiagram();
  var sets = [
            {sets:["Bob's"], size: 1},
            {sets:["Bob's", "Bowed"], size: 1},
            {sets: ['Plucked'], size: 12},
             {sets: ['Bowed'], size: 12},
             {sets: ['Bowed','Plucked'], size: 2}];
  d3.select(".animation").datum(sets).call(chart);
  d3.select(".text").append('p').text(text1).attr('id', "t1")
  d3.select(".text").append('p').text(text2).attr('id', "t2")
  d3.select(".text").append('p').text(text3).attr('id', "t3")



  $e = $('.animation', '#m1c1s1');




  // var svg = d3.select(".scroll").append("svg")
  //   .attr("width", width)
  //   .attr("height", height)
  // .append("g")
  //   .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

  // d3.json("/json/instruments.json", function(error, root){
  //   if (error) throw error;
  //   root = d3.hierarchy(root).sum(function(d) { return 1; })
  //   console.log(root)
  // })

})

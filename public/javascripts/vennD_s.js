var venn = require("venn.js")
var text1 = "First, consider a circle that contains all plucked intruments and another one that contains all bowed instruments."

var text2 = "Premise 1 tells that whatever instrument Bob plays belongs to the bowed circle. Based on this premise alone, do we have good enough reason to think that Bob does not play the guitar?"

var text3 = "Not quite - since that premise alone does not give us enough information to where guitars would be in this diagram. If, for instance, there are guitars that are both plucked and bowed, then the fact that Bob plays a bowed instrument is not sufficient to rule out the possibility of him playing the guitar."

var text4 =  "This is exactly why the second premise is important: it tells us that guitars are not played with bows. This means that it is impossible for the guitar circle to be inside of the overlapping areas."



// This means that there is no way Bob's choice of instrument would be part of hte guitar circle. In other words, the premises necessitates  that the conclusion: if the premises are true, then the conlucsion has to be true."


  $canvas = $('.animation', '#m1c1s1');
  $canvas2 = $('.animation', '#m1c1s2');
var bobLabel,
    bobLine,
    bobText,
    bowed,
    bowedText,
    plucked,
    pluckedtext,
    height,
    width,
    radius,
    freezePoint;

$(function(){

  var frame = [];
  var i = 0
  scrollTop = 0
  newScrollTop = 0
  var marginTop = 300
  // d3.select('#t1').style("margin-top", marginTop)

  var startPoint = tp('#t1') - window.innerHeight/2


  $(window).on('scroll',function(){
      newScrollTop = $(window).scrollTop()




    })

  function tp(id){
    return $(id).offset().top + ($(id).height()/2) - (window.innerHeight/2)
  }





  width = $canvas.width()
  height = width
  radius = (Math.min(width, height) / 4);

  var bowedColor = "#7E8959"

  var pluckedColor = "#C9AC68"

  var guitarColor = "#7E6B71"
  var bobColor = "#B25538"
  var lineScale,
      firstScale;
  function setDimensions(){
      width = $canvas.width()
      height = width
      radius = (Math.min(width, height) / 4);
     bowedX = width/3
     bowedY = height/2
     pluckedX = 2*width/3
     pluckedY = height/2
     guitarX = 2.2*width/3;
     guitarY = 1.3*height/2
     bobX = bowedX/2
     bobY = bowedY
     freezePoint = $canvas.position().top + ($canvas.height()/2) - (window.innerHeight/2)
     point = $canvas.offset().top + $canvas.height() - window.innerHeight
     firstScale = d3.scaleLinear()
                      .domain([startPoint,tp('#t1')])
                      .range([0,0.6])
                      .clamp(true)
     lineYScale = d3.scaleLinear()
                      .domain([tp('#t1'),tp('#t2')])
                      .range([bobY, bobY - radius - 30])
                      .clamp(true)
      lineOScale = d3.scaleLinear()
                       .domain([tp('#t2'),tp('#t3')-300])
                       .range([1, 0])
                       .clamp(true)
     bobNameScale = d3.scaleLinear()
                      .domain([tp('#t1'),tp('#t2'),tp('#t3')-300])
                      .range([0, 1,0])
                      .clamp(true)
      bobScale = d3.scaleLinear()
                       .domain([tp('#t1'),tp('#t2')])
                       .range([0, 0.7])
                       .clamp(true)
     guitarOScale = d3.scaleLinear()
                      .domain([tp('#t2'),tp('#t3')])
                      .range([0, 0.6])
                      .clamp(true)
    guitarXScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')])
                     .range([0, radius])
                     .clamp(true)
    bobXScale = d3.scaleLinear()
                     .domain([tp('#t2'),tp('#t3')])
                     .range([bobX, width/2])
                     .clamp(true)



     freezePoint2 = $canvas2.position().top + ($canvas2.height()/2) - (window.innerHeight/2)
     point = $canvas2.offset().top + $canvas2.height() - window.innerHeight
  }
  var svg = d3.select("#m1c1s1 .animation").append("svg")
    .attr("width", width)
    .attr("height", height)
  setDimensions();
// console.log(freezePoint)



  svg.append('g').attr('class','bigCircles').append("circle").attr("r",radius).attr("cx",bowedX).attr("cy", bowedY).style('fill', bowedColor)
  svg.append('text').attr('class','bigCircles').text('Bowed').attr("dx",bowedX - 40).attr("dy", bowedY).style('fill','black')
  svg.append('g').attr('class','bigCircles').append("circle").attr("r",radius).attr("cx",pluckedX).attr("cy", pluckedY).style('fill',pluckedColor)
  svg.append("text").attr('class','bigCircles').text("Plucked").attr("dx",pluckedX - 30).attr("dy", pluckedY).style('fill','black')
  d3.selectAll('.bigCircles').transition().style('opacity', 0)
  svg.append('g').append('line')
              .attr('class', 'bobLabel').
              attr('id', "bobLine")
                .attr("x1", bobX)
                .attr("y1",bobY)
                .attr("x2", bobX)
                .attr("y2",bobY )
                .attr("stroke-width", 1)
                .attr("stroke","black")
  svg.append('text')
    .text("Premise 1: Bob plays a bowed instrument.")
    .attr('class', "bobLabel")
    .attr('id', "bobName")
    .attr("dx",bobX - 40)
    .attr("dy", bobY - radius-40)
    .style('opacity',0)
  svg.append("g").append("circle").attr('id', 'bob').attr("r",radius/8).attr("cx",bobX).attr("cy",bobY ).style('fill', bobColor).attr('opacity', 0)


      var guitar = svg
                .append("g").attr('id','guitarStuff').attr('opacity',0)
                .append("circle").attr("r",radius/3).attr("cx",width/2).attr("cy", bobY).style('fill',guitarColor).attr('id', 'guitar')
      var guitarText = d3.select('#guitarStuff').append("text").text("Guitar").attr("dx",width/2).attr("dy", bobY).style('fill','black')















  function graphics(){
    // console.log(firstScale(scrollTop))
    d3.selectAll('.bigCircles').transition().duration(500).style('opacity', firstScale(scrollTop))
   d3.select("#bobLine")
                  .attr("y2", lineYScale(scrollTop))
    d3.select('#bobName')
                  .style('opacity',bobNameScale(scrollTop))
    d3.selectAll('#bobLine')
      .style('opacity', lineOScale(scrollTop))

      // console.log("ls" + lineOScale(scrollTop))
   d3.select('#bob')
            .style('opacity',bobScale(scrollTop))
            .attr('cx',bobXScale(scrollTop))
    d3.select('#guitarStuff').style('opacity',guitarOScale(scrollTop))
    d3.select('#guitarStuff').attr("transform",'translate(' + guitarXScale(scrollTop) + ')')

  }
//second animation

// var svg2 = d3.select("#m1c1s2 .animation").append("svg")
//   .attr("width", width)
//   .attr("height", height)

  var sets = [ {sets: ['Plucked'], size: 12},
               {sets: ['Guitar'], size: 6},
               {sets: ['Plucked','Guitar'], size: 6}];
  var sets2 = [ {sets: ['Plucked'], size: 12},
               {sets: ['Guitar'], size: 6},
               {sets: ['Plucked','Guitar'], size: 3}];
  var chart = venn.VennDiagram()
  venn = d3.select("#m1c1s2 .animation").datum(sets).call(chart);
  $('path','g[data-venn-sets = "Plucked"]').css('fill', pluckedColor).css('fill-opacity',0.7)
  $('path','g[data-venn-sets = "Guitar"]').css('fill', guitarColor).css('fill-opacity',0.7)
  venn = d3.select("#m1c1s2 .animation").datum(sets2).call(chart);
  // console.log(d3.selectAll("#m1c1s2 .venn-circle path").)
  //real time stuff

  var status
  function sticky(e){
    var ePos = (e.offset())
    e.css('position','fixed')
      .css('top',  ePos.top - $(window).scrollTop() )
      .css('left',  ePos.left - $(window).scrollLeft())

  }

  function unstick(e){
    temp = e.offset()
    // console.log(tempLeft)
    e.css('position','absolute')
            .css('top',temp.top)
            .css('left',temp.left)
  }


  var render = function() {
    // in case page start within the frozen area (eg reloading)
    if (scrollTop > startPoint && scrollTop<tp('#t4') && status == undefined){
      var ePos = ($canvas.position())
      $canvas.css('position','fixed')
        .css('top', window.innerHeight/5)
        .css('left',  ePos.left - $(window).scrollLeft())
        status = "frozen"


    }


  // Don't re-render if scroll didn't change
  if (scrollTop !== newScrollTop) {
    console.log(status)


    if (newScrollTop < startPoint) status = "initial"


    // Graphics Code Goes Here
    scrollTop = newScrollTop;

   graphics()

    if ((newScrollTop > freezePoint && status == "initial")|| (newScrollTop < tp('#t4') && status == "done")) {
      sticky($canvas);
      status = "frozen"
    } else if (status == 'frozen' && (newScrollTop > tp('#t4') || newScrollTop<freezePoint)){
      unstick($canvas)
      if (newScrollTop > tp('#t4')) status = "done"
      else if (newScrollTop<freezePoint) status = "initial"

    }


    if (scrollTop > freezePoint2 && status == "done"){
      sticky($canvas2)
      status = "frozen2";
    } else if (scrollTop < freezePoint2 && status == "frozen2"){
      unstick($canvas2)
      status = "done";
    }


  }
  window.requestAnimationFrame(render)
}

  window.requestAnimationFrame(render)
  window.onresize = setDimensions



  // .attr("x1", bobX).attr("y1",bobY).attr("x2", bobX).attr("y2",bobY - radius).attr("stroke-width", 2).attr("stroke","black")
  // var bobLabel = svg.append('text').text("What Bob plays").attr("dx",bobX - 20).attr("dy", bobY - radius-10).style('fill', "black")




  // d3.json("/json/guitar.json", function(error, root){
  //   if (error) throw error;
  //   root = d3.hierarchy(root).sum(function(d) { return 1; })
  //   diameter = $('#logicize').width()
  //   format = d3.format(",d");
  //   logsvg = d3.select('#logicize').append('svg').attr('width',diameter).attr('height',diameter)
  //   var pack = d3.pack()
  //   .size([diameter, diameter]);
  //   console.log(pack(root).descendants())
  //
  //   g = logsvg.append("g")
  //
  //   var node = g.selectAll(".node")
  //   .data(pack(root).descendants())
  //   .enter().append("g")
  //     .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
  //     .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  //
  // node.append("title")
  //     .text(function(d) { return d.data.name + "\n" + format(d.value); });
  //
  // node.append("circle")
  //     .attr("r", function(d) { return d.r; });
  //
  // node.filter(function(d) { return !d.children; }).append("text")
  //     .attr("dy", "0.3em").attr("transform", "translate(-40)")
  //     .text(function(d) { return d.data.name });
  // })

})

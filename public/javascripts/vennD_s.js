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
    guitarCircle,
    guitarText,
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



  var width
  var height
  var radius

  var bowedColor = "#7E8959"

  var pluckedColor = "#C9AC68"

  var guitarColor = "#7E6B71"
  var bobColor = "#B25538"
  var lineScale,
      firstScale,
      vennEulerScale,
      vennOScale,
      vennSScale,
      nums,
      chart;
  function setDimensions(){
      width = $('main').width()/2
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

     freezePoint = tp('#t1')


     firstScale = d3.scaleLinear()
                      .domain([startPoint,tp('#t1')])
                      .range([0,0.6])
                      .clamp(true)
     lineYScale = d3.scaleLinear()
                      .domain([tp('#t1'),tp('#t2')])
                      .range([bobY, bobY - 1.2*radius])
                      .clamp(true)
      lineOScale = d3.scaleLinear()
                       .domain([tp('#t2'),tp('#t3')-250])
                       .range([1, 0])
                       .clamp(true)
     p2TextOScale = d3.scaleLinear()
                      .domain([tp('#t3'),tp('#t4')-250])
                      .range([0, 0.8])
                      .clamp(true)
    p2LineYScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')])
                     .range([bobY - 1.2*radius, bobY - radius/5])
                     .clamp(true)
   p2LineXScale = d3.scaleLinear()
                    .domain([tp('#t3'),tp('#t4')])
                    .range([width*0.7, width/2+radius])
                    .clamp(true)
    cLineYScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')])
                     .range([bobY + 1.4*radius, bobY])
                     .clamp(true)
     bobNameScale = d3.scaleLinear()
                      .domain([tp('#t1'),tp('#t2'),tp('#t3')-300])
                      .range([0, 0.8,0])
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

    vennEulerScale = d3.scaleLinear()
              .domain([tp('#t5')+200, tp('#t6')])
              .range([6,3])
              .clamp(true)

    vennEulerScale2 = d3.scaleLinear()
              .domain([tp('#t5')+200, tp('#t6')])
              .range([6,12])
              .clamp(true)
    vennOScale = d3.scaleLinear()
             .domain([tp('#t5')+200, tp('#t6')])
             .range([0.7,0])
             .clamp(true)
    vennInterScale = d3.scaleLinear()
                   .domain([tp('#t7'), tp('#t8')])
                   .range([0,1])
                   .clamp(true)
   vennGuitarScale = d3.scaleLinear()
                  .domain([tp('#t7'), tp('#t8')])
                  .range([255,130])
                  .clamp(true)
      numScale = d3.scaleLinear()
                     .domain([tp('#t6')+200, tp('#t7')])
                     .range([0,0.7])
                     .clamp(true)
     freezePoint2 = tp('#t5')
     chart = venn.VennDiagram().width(width)
      nums = [
       {"num":"1","dx":width/3, "dy": chart.height()/2},
       {"num":"2","dx":width/2,"dy": chart.height()/2},
       {"num":"3","dx":2*width/3,"dy": chart.height()/2},
       {"num":"4","dx":width*.9,"dy": chart.height()*.1}
     ]


  }
  var svg = d3.select("#m1c1s1 .animation").append("svg")
    .attr("width", width)
    .attr("height", height)


    function graphicInit(){

        bowedCircle = svg.append('g').attr('class','bigCircles').attr('id','bowedCircle').append("circle").attr("r",radius).attr("cx",bowedX).attr("cy", bowedY).style('fill', bowedColor)
        bowedText =  svg.append('text').attr('class','bigCircles').text('Bowed').attr("dx",bowedX - 40).attr("dy", bowedY + 1.2*radius).style('fill','black')
        pluckedCircle = svg.append('g').attr('class','bigCircles').attr('id','pluckedCircle').append("circle").attr("r",radius).attr("cx",pluckedX).attr("cy", pluckedY).style('fill',pluckedColor)
        pluckedText = svg.append("text").attr('class','bigCircles').text("Plucked").attr("dx",pluckedX - 30).attr("dy", pluckedY + 1.2*radius).style('fill','black')
        d3.selectAll('.bigCircles').transition().style('opacity', 0)
        bobLine = svg.append('g').append('line')
                    .attr('class', 'bobLabel').
                    attr('id', "bobLine")
                      .attr("x1", bobX)
                      .attr("y1",bobY)
                      .attr("x2", bobX)
                      .attr("y2",bobY )
                      .attr("stroke-width", 2)
                      .attr("stroke","black")
        bobText = svg.append('text')
          .text("Premise 1: Bob plays a bowed instrument.")
          .attr('class', "bobLabel")
          .attr('id', "bobName")
          .attr("dx",bobX - 40)
          .attr("dy", bobY - radius-40)
          .style('opacity',0)
        bobCircle = svg.append("g").append("circle").attr('id', 'bob').attr("r",radius/8).attr("cx",bobX).attr("cy",bobY ).style('fill', bobColor).attr('opacity', 0)
        p2text = svg.append('text')
                    .text('Premise 2: no guitar is bowed.').attr("dx",width/2).attr("dy", bobY - 1.3*radius).style('fill','black').style('opacity',0)
        b = [{x: width*0.7 ,y: bobY - 1.2*radius},{x: width*0.7, y: bobY - 1.2*radius}]

        line = d3.line().x(function(d){return d.x}).y(function(d){return d.y})
        p2line = d3.select('#m1c1s1 svg').append('path').attr('d',line(b)).attr('stroke', 'black').attr('stroke-width','2').attr('fill-opacity', 0)
        // bline = d3.line().x(function(c){return d.x}).y(function(d){return d.y})
        conclusionText = svg.append('text')
                    .text('Conclusion: Bob does not play the guitar.').attr("dx",width/2 - radius).attr("dy", bobY + 1.5*radius ).style('fill','black').style('opacity',0)
        c = [{x:width/2 ,y: bobY + 1.4*radius}]
        //
        // line = d3.line().x(function(d){return d.x}).y(function(d){return d.y})
        cline = d3.select('#m1c1s1 svg').append('path').attr('d',line(c)).attr('stroke', 'black').attr('stroke-width','2').attr('fill-opacity', 0)



      guitarCircle = svg
                .append("g").attr('id','guitarStuff').attr('opacity',0)
                .append("circle").attr("r",radius/3).attr("cx",width/2).attr("cy", bobY).style('fill',guitarColor)
      guitarText = d3.select('#guitarStuff').append("text").text("Guitar").attr("dx",width/2).attr("dy", bobY).style('fill','black')



    }

    function resize(){
      setDimensions();
      setSVGsize();
      sticky()
      d3.selectAll('.bigCircles circle').attr('r', radius)
      bowedCircle.attr('r', radius).attr("cx",bowedX).attr("cy", bowedY)
      bowedText.attr("dx",bowedX - 30).attr("dy", bowedY + 1.2*radius)
      pluckedCircle.attr('r', radius).attr("cx",pluckedX).attr("cy", pluckedY)
      pluckedText.attr("dx",pluckedX - 40).attr("dy", pluckedY + 1.2*radius )
        bobLine .attr("x1", bobX)
                 .attr("y1",bobY)
                 .attr("x2", bobX)
                  .attr("y2", lineYScale(scrollTop))
      bobText.attr("dx",bobX - 40)
        .attr("dy", bobY - radius-40)
      guitarText.attr('dy', bobY).attr("dx",width/2)
      // console.log(guitarCircle)
      guitarCircle.attr('cy', bobY).attr("r",radius/3).attr("cx",width/2)
        bobCircle.attr("r",radius/8)
      graphics()
      chart.width(width)
      // numText.select('text.num')
      //     .data(nums,function(d){
      //       return d})
      //     .enter()
      //     .attr('dx',function(d){return d.dx}).attr('dy', function(d){return d.dy})

      // console.log(guitarCircle)
    }

    function setSVGsize(){
      $('svg', $canvas)
      .css('width', width)
      .css('height', height)
    }
  setDimensions();
  graphicInit();
// console.log(freezePoint)

  function graphics(){
    b = [{x: width*0.7, y: bobY - 1.2*radius},{x: p2LineXScale(scrollTop) , y: p2LineYScale(scrollTop)}]
    c = [{x:width/2 ,y: bobY + 1.4*radius},{x:width/2  ,y: cLineYScale(scrollTop) }]
    p2line.transition().duration(300).attr('d',line(b))
    cline.transition().duration(300).attr('d',line(c))
    // console.log(firstScale(scrollTop))
    p2text.transition().duration(300).style('opacity',p2TextOScale(scrollTop))
    conclusionText.transition().duration(300).style('opacity',p2TextOScale(scrollTop))
    d3.selectAll('.bigCircles').transition().duration(300).style('opacity', firstScale(scrollTop))
   d3.select("#bobLine")
                 .attr("x1", bobX)
                 .attr("y1",bobY)
                 .attr("x2", bobX)
                  .attr("y2", lineYScale(scrollTop))
    d3.select('#bobName').transition().duration(300)
                  .style('opacity',bobNameScale(scrollTop))
    d3.selectAll('#bobLine').transition().duration(300)
      .style('opacity', lineOScale(scrollTop))

      // console.log("ls" + lineOScale(scrollTop))
   d3.select('#bob').transition().duration(300)
            .style('opacity',bobScale(scrollTop))
            .attr('cx',bobXScale(scrollTop))
            .attr('cy',bobY)
    d3.select('#guitarStuff').style('opacity',guitarOScale(scrollTop))
    d3.select('#guitarStuff').transition().duration(300).attr("transform",'translate(' + guitarXScale(scrollTop) + ')')

  }
//second animation

// var svg2 = d3.select("#m1c1s2 .animation").append("svg")
//   .attr("width", width)
//   .attr("height", height)

  var sets = [ {sets: ['Plucked'], size: 12},
           {sets: ['Guitar'], size: vennEulerScale2(scrollTop)},
         {sets: ['Plucked','Guitar'], size: vennEulerScale(scrollTop)}];



  vennD = d3.select("#m1c1s2 .animation").datum(sets).call(chart)
  $('path','g[data-venn-sets = "Plucked"]').css('fill', "white").css('fill-opacity',0.7).css('stroke', pluckedColor).css('stroke-opacity',0.7).css("stroke-width", 2)
  $('path','g[data-venn-sets = "Guitar"]').css('fill', "white").css('fill-opacity',0.7).css('stroke', guitarColor).css('stroke-opacity',0.7).css("stroke-width", 2)
  $('path','g[data-venn-sets = "Plucked_Guitar"]').css('fill', "white").css('fill-opacity',0).css("stroke-width", 2)
  // console.log(vennD.selectAll('path'))


  numText = vennD.select('svg').selectAll('text.nums')
      .data(nums,function(d){
        return d})
      .enter()
      .append('text').attr('class','nums').text(function(d){
        return d.num})
      .attr('dx',function(d){return d.dx}).attr('dy', function(d){return d.dy})
      .style('font-size','1.5em').style('opacity',0)
  // vennD.select('svg').append('text').text("2").attr('dx', chart.width()/2).attr('dy', chart.height()/2)
  // vennD.select('svg').append('text').text("1").attr('dx', chart.width()/3).attr('dy', chart.height()/2)
  // vennD.select('svg').append('text').text("3").attr('dx', 2*chart.width()/3).attr('dy', chart.height()/2)
  // vennD.select('svg').append('text').text("4").attr('dx', chart.width()*.9).attr('dy', chart.height()*.1)
  // vennD = d3.select("#m1c1s2 .animation").datum(sets).call(chart)


  function graphics2(){
    numText.style('opacity', numScale(scrollTop))
    sets = [ {sets: ['Plucked'], size: 12},
                 {sets: ['Guitar'], size: vennEulerScale2(scrollTop)},
                 {sets: ['Plucked','Guitar'], size: vennEulerScale(scrollTop)}];
                //  console.log(vennOScale(scrollTop))
    vennD = d3.select("#m1c1s2 .animation").datum(sets).call(chart)
    d3.select('g[data-venn-sets = "Plucked_Guitar"]').select('path').style('fill-opacity', vennInterScale(scrollTop))
    rgb = Math.round(vennGuitarScale(scrollTop))
    d3.select('g[data-venn-sets = "Guitar"]').select('path').style('fill',"rgb("+rgb+","+rgb+','+rgb+")")
    // console.log("rgb("+vennGuitarScale(scrollTop)+","+vennGuitarScale(scrollTop)+','+vennGuitarScale(scrollTop)+")")
// console.log(d3.select('g[data-venn-sets = "Guitar"]').select('path'))


  }


  //real time stuff


  function sticky(){


    if (scrollTop > freezePoint && scrollTop < tp('#t4')){

      $canvas.css('position','fixed')
        .css('top',   window.innerHeight/2 - $canvas.height()/2)
        .css('left',  window.innerWidth/2)
        setSVGsize()
    } else if (scrollTop <freezePoint){

      $canvas.css('position','absolute')
        .css('top',   $('#t1').offset().top - $canvas.height()/2)
        .css('left',  window.innerWidth/2)
        setSVGsize()

    } else if (scrollTop >tp('#t4')){
      $canvas.css('position','absolute')
        .css('top',   $('#t4').offset().top - $canvas.height()/2)
        .css('left',  window.innerWidth/2)
        setSVGsize()
    }

    if (scrollTop > freezePoint2 && scrollTop < tp('#t8')){
      $canvas2.css('position','fixed')
        .css('top',   window.innerHeight/2 - $canvas2.height()/2)
        .css('left',  window.innerWidth/2)
    } else if (scrollTop <freezePoint2){
      $canvas2.css('position','absolute')
        .css('top',   $('#t5').offset().top - $canvas2.height()/3)
        .css('left',  window.innerWidth/2)
    } else if (scrollTop >tp('#t8')){
      $canvas2.css('position','absolute')
        .css('top',   $('#t8').offset().top - $canvas2.height()/3)
        .css('left',  window.innerWidth/2)
    }

  }



  var render = function() {


  // Don't re-render if scroll didn't change
  if (scrollTop !== newScrollTop) {

    // console.log(newScrollTop)

    if (newScrollTop < startPoint) status = "initial"


    // Graphics Code Goes Here
    scrollTop = newScrollTop;

    graphics()
    graphics2()
    sticky();



  }
  window.requestAnimationFrame(render)
}

  window.requestAnimationFrame(render)
  window.onresize = resize



})

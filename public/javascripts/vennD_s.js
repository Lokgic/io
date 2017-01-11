var venn = require("venn.js")
var readingExMC = require("./mods/readingExMC.js")


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
  var scrollAnimationDuration = 200;
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
      chart,
      moodsChart,
      moodWidth;

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
     slideDuration = 250

     firstScale = d3.scaleLinear()
                      .domain([startPoint,tp('#t1')-slideDuration])
                      .range([0,0.6])
                      .clamp(true)
     lineYScale = d3.scaleLinear()
                      .domain([tp('#t1'),tp('#t2')-slideDuration])
                      .range([bobY, bobY - 1.2*radius])
                      .clamp(true)
      lineOScale = d3.scaleLinear()
                       .domain([tp('#t2'),tp('#t3')-slideDuration])
                       .range([1, 0])
                       .clamp(true)
     p2TextOScale = d3.scaleLinear()
                      .domain([tp('#t3'),tp('#t4')-slideDuration])
                      .range([0, 0.8])
                      .clamp(true)
    p2LineYScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')-slideDuration])
                     .range([bobY - 1.2*radius, bobY - radius/5])
                     .clamp(true)
   p2LineXScale = d3.scaleLinear()
                    .domain([tp('#t3'),tp('#t4')])
                    .range([width*0.7, width/2+radius])
                    .clamp(true)
    cLineYScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')-slideDuration])
                     .range([bobY + 1.4*radius, bobY])
                     .clamp(true)
     bobNameScale = d3.scaleLinear()
                      .domain([tp('#t1'),tp('#t2')-slideDuration,tp('#t3')-slideDuration])
                      .range([0, 0.8,0])
                      .clamp(true)
      bobScale = d3.scaleLinear()
                       .domain([tp('#t1'),tp('#t2')-slideDuration])
                       .range([0, 0.7])
                       .clamp(true)
     guitarOScale = d3.scaleLinear()
                      .domain([tp('#t2'),tp('#t3')-slideDuration])
                      .range([0, 0.6])
                      .clamp(true)
    guitarXScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')-slideDuration])
                     .range([0, radius])
                     .clamp(true)
    bobXScale = d3.scaleLinear()
                     .domain([tp('#t2'),tp('#t3')-slideDuration])
                     .range([bobX, width/2])
                     .clamp(true)

    vennEulerScale = d3.scaleLinear()
              .domain([tp('#t5')+200, tp('#t6')-slideDuration])
              .range([6,3])
              .clamp(true)

    vennEulerScale2 = d3.scaleLinear()
              .domain([tp('#t5')+200, tp('#t6')-slideDuration])
              .range([6,12])
              .clamp(true)
    vennOScale = d3.scaleLinear()
             .domain([tp('#t5')+200, tp('#t6')-slideDuration])
             .range([0.7,0])
             .clamp(true)
    vennInterScale = d3.scaleLinear()
                   .domain([tp('#t7'), tp('#t8')-slideDuration])
                   .range([0,1])
                   .clamp(true)
   vennGuitarScale = d3.scaleLinear()
                  .domain([tp('#t7'), tp('#t8')-slideDuration])
                  .range([255,130])
                  .clamp(true)
      numScale = d3.scaleLinear()
                     .domain([tp('#t6')+200, tp('#t7')-slideDuration])
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

  function Oscale(s,e,max){
    max = (max == null)? 0.7 :max
    output = d3.scaleLinear()
                     .domain([tp(s),tp(e)-slideDuration])
                     .range([0, max])
                     .clamp(true)
      return output(scrollTop)
    }


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


      conclusionText.attr("dx",width/2 - radius).attr("dy", bobY + 1.5*radius )
      c = [{x:width/2 ,y: bobY + 1.4*radius},{x:width/2  ,y: cLineYScale(scrollTop) }]      //
      // line = d3.line().x(function(d){return d.x}).y(function(d){return d.y})
      cline.attr('d',line(c))


      graphics2TextAdd()

      moodWidth = $('#moods .col-md-6').width()
      moodsChart = venn.VennDiagram().width(moodWidth)
      moodsVenn = d3.selectAll("#moods .col-md-6")
            .datum([
              {sets:["S"],size:3},
              {sets:["P"],size:3},
              {sets:["S", "P"],size:1}
                ]).call(moodsChart)


      pnText.transition().duration(1500).attr('dx',moodWidth/2).attr('dy',$('svg','#pa').height()/2)

      paText.transition().duration(1500).attr('dx',moodWidth/4).attr('dy',$('svg','#pa').height()/2)
      $canvas3.html("")
      chart3 = venn.VennDiagram().height(width).width(width).duration(scrollAnimationDuration)
      venn3Init()

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
    p2line.transition().duration(scrollAnimationDuration).attr('d',line(b))
    cline.transition().duration(scrollAnimationDuration).attr('d',line(c))
    // console.log(firstScale(scrollTop))
    p2text.transition().duration(scrollAnimationDuration).style('opacity',p2TextOScale(scrollTop))
    conclusionText.transition().duration(scrollAnimationDuration).style('opacity',p2TextOScale(scrollTop))
    d3.selectAll('.bigCircles').transition().duration(scrollAnimationDuration).style('opacity', firstScale(scrollTop))
   d3.select("#bobLine")
                 .attr("x1", bobX)
                 .attr("y1",bobY)
                 .attr("x2", bobX)
                  .attr("y2", lineYScale(scrollTop))
    d3.select('#bobName').transition().duration(scrollAnimationDuration)
                  .style('opacity',bobNameScale(scrollTop))
    d3.selectAll('#bobLine').transition().duration(scrollAnimationDuration)
      .style('opacity', lineOScale(scrollTop))

      // console.log("ls" + lineOScale(scrollTop))
   d3.select('#bob').transition().duration(scrollAnimationDuration)
            .style('opacity',bobScale(scrollTop))
            .attr('cx',bobXScale(scrollTop))
            .attr('cy',bobY)
    d3.select('#guitarStuff').style('opacity',guitarOScale(scrollTop))
    d3.select('#guitarStuff').transition().duration(scrollAnimationDuration).attr("transform",'translate(' + guitarXScale(scrollTop) + ')')

  }
//second animation

// var svg2 = d3.select("#m1c1s2 .animation").append("svg")
//   .attr("width", width)
//   .attr("height", height)

  var sets = [ {sets: ['Plucked'], size: 12},
           {sets: ['Guitar'], size: vennEulerScale2(scrollTop)},
         {sets: ['Plucked','Guitar'], size: vennEulerScale(scrollTop)}];



  vennD = d3.select("#m1c1s2 .animation").datum(sets).call(chart)
  $('path','g[data-venn-sets = "Plucked"]').css('fill', "white").css('fill-opacity',0.7).css('stroke', "black").css('stroke-opacity',1).css("stroke-width", 5)
  $('path','g[data-venn-sets = "Guitar"]').css('fill', "white").css('fill-opacity',0.7).css('stroke', "black").css('stroke-opacity',1).css("stroke-width", 5)
  $('path','g[data-venn-sets = "Plucked_Guitar"]').css('fill', "white").css('fill-opacity',0).css("stroke-width", 5)

function graphics2TextAdd(){
  d3.selectAll('.nums').remove()
  d3.selectAll('#X').remove()
  numText = vennD.select('svg').selectAll('text .nums')
      .data(nums,function(d){
        return d})
      .enter()
      .append('text').attr('class','nums').text(function(d){
        return d.num})
      .attr('dx',function(d){return d.dx}).attr('dy', function(d){return d.dy})
      .style('font-size','1.5em')
      .style('opacity',Oscale("#t6","#t7",1))
    xPos = []
   temp =  d3.select('g[data-venn-sets="Guitar"] path').attr('d').split(' ')
  //  console.log(temp)
   xPos[0] = parseInt(temp[1]) + parseInt(temp[4])
   xPos[1] = parseInt(temp[2])
  //  console.log(xPos)

    vennD.select('svg')
    .append('text')
    .attr('id',"x")
    .text("X")
    .attr('dx', xPos[0])
    .attr('dy', xPos[1])
    .style('font-size','3em')
    .style('opacity',  Oscale("#t8","#t9"))
    .style('transform','translate(-.35em)')


}


 graphics2TextAdd()


  //third
  chart3 = venn.VennDiagram().height(width).width(width).duration(scrollAnimationDuration)
  canvas3 = d3.select('#m1c1s3 .animation')
  $canvas3 = $('.animation', '#m1c1s3')
  sets3 = [
    {sets: ['Dogs'], size: 4},
   {sets: ['Mammals'], size: 4},
   {sets: ['Vertebrates'], size: 4},
   {sets: ['Mammals',"Vertebrates"], size: 1},
   {sets: ['Mammals',"Dogs"], size: 1},
   {sets: ['Vertebrates',"Dogs"], size: 1},
   {sets: ['Vertebrates',"Dogs","Mammals"], size: 1},

  ]


  function graphic3(){
      d3.select('g[data-venn-sets = "Mammals"] path').style('fill-opacity',Oscale('#t10','#t11'))
      d3.select('g[data-venn-sets = "Dogs"] path').style('fill-opacity',Oscale('#t11','#t12'))

  }

    function venn3Init(){

      venn3 = canvas3.datum(sets3).call(chart3)
      venn3.selectAll('path').style("fill", 'white')
          .style('fill-opacity',0)
          .style('stroke', "black")
          .style('stroke-opacity',1)
          .style('stroke-width',3)

        d3.select('g[data-venn-sets = "Mammals"] path').style('fill', '#999').style('fill-opacity',Oscale('#t10','#t11'))
        d3.select('g[data-venn-sets = "Dogs"] path').style('fill', '#999').style('fill-opacity',Oscale('#t11','#t12'))
        d3.select('g[data-venn-sets = "Vertebrates_Dogs_Mammals"] path').style('fill', 'white').style('fill-opacity',1)
        d3.select('g[data-venn-sets = "Mammals_Vertebrates"] path').style('fill', 'white').style('fill-opacity',1)

    }

  venn3Init()

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
    d3.select('#x').style('opacity',Oscale("#t8","#t9"))




  }


  //real time stuff


  function sticky(){

    freezePoints('#t1','#t4',$canvas)

    freezePoints('#t5','#t9',$canvas2)
    freezePoints('#t10','#t13',$canvas3)
  }

  function freezePoints(startdiv, enddiv,canvasJQ){
    start = tp(startdiv)
    end = tp(enddiv)
    if (scrollTop > start && scrollTop <end){
      canvasJQ.css('position','fixed')
        .css('top',   window.innerHeight/2 - canvasJQ.height()/2)
        .css('left',  window.innerWidth/2)
    } else if (scrollTop <start){
      canvasJQ.css('position','absolute')
        .css('top',   $(startdiv).offset().top - canvasJQ.height()/3)
        .css('left',  window.innerWidth/2)
    } else if (scrollTop >(end+60)){
      canvasJQ.css('position','absolute')
        .css('top',   $(enddiv).offset().top - canvasJQ.height()/3+60)
        .css('left',  window.innerWidth/2)
    }
    setSVGsize()
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
    graphic3()
    sticky();
    graphics2TextAdd()



  }
  window.requestAnimationFrame(render)
}

  window.requestAnimationFrame(render)
  window.onresize = resize


//static
  moods = d3.select('#moods')

  moodsName = ["Universal Affirmative","Universal Negative","Particular Affirmative","Particular Negative"]
  moodsStatement = ["All S are P", "All S are not P", "Some S are P", "Some S are not P"]
  moodsLabel = ["ua","un","pa","pn"]
  for (i in moodsLabel){
    moods.append('div').attr('class','col-md-6').attr('id',moodsLabel[i])
    moods.select('#'+moodsLabel[i]).append('p').attr('class','text-xs-center m-y-0').text(moodsName[i])
  }
  moodWidth = $('#moods .col-md-6').width()
  moodsChart = venn.VennDiagram().width(moodWidth).duration(scrollAnimationDuration)
  moodsVenn = d3.selectAll("#moods .col-md-6")
        .datum([
          {sets:["S"],size:3},
          {sets:["P"],size:3},
          {sets:["S", "P"],size:1}
            ]).call(moodsChart)

  moodsVenn.selectAll('path').style("fill", null)
      .style('fill-opacity',1)
      .style('stroke', "black")
      .style('stroke-opacity',1)
      .style('stroke-width',3)



  for (i in moodsStatement){

    moods.select('#'+moodsLabel[i]).append('p').attr('class','text-xs-center m-b-3').text('"' + moodsStatement[i] + '"')
  }
  d3.selectAll("#moods text").style("font-size", "2em")



  paText = d3.select('#pa').select('svg').append('text').text('X').attr('dx',moodWidth/2).attr('dy',$('svg','#pa').height()/2).style('fill','black').style('font-size','2.5em')

  pnText = d3.select('#pn').select('svg').append('text').text('X').attr('dx',moodWidth/4).attr('dy',$('svg','#pa').height()/2).style('fill','black').style('font-size','2.5em')



function sylToString(prob){
  output = {
    str:["Premise 1: "+prob.p1str, "Premise 2: "+prob.p2str, "Conlucsion: "+ prob.cstr],
    form:prob.form,
    choices: ["Valid", "Invalid"]
  }

  output.ans = (prob.valid)? "Valid" : "Invalid"
  return output

}

function loadSyl(callback){
  jQuery.post("../processing/syllogism/list")
  .done(function(data){
      callback(null, data);
  }).fail()
};


function loadCats(callback){
  jQuery.post("../processing/syllogism/cats")
  .done(function(data){
      callback(null, data);
  }).fail(function(f){console.log(f)})
};




loadSyl(function(e,d){

  var problemsSet = []
  for (problem in d){
    problemsSet.push(sylToString(d[problem]))
  }
  console.log(problemsSet)
  readingExMC(problemsSet, '#reading1-1-1 .readingEx')
})

loadCats(function(e,d){
  console.log(d)
  readingExMC(d, '#reading1-1-2',"venn")
})



})

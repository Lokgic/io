var venn = require("venn.js")

$(function(){
  var currentScore ;

    function loadJSON(type, callback){
        $.getJSON('../json/' + type + '.json')
        .done(function(data){
        callback(null, data);
     }).fail(function(){console.log('Failed to Load Quiz')});
    }

    function updateScore(){
      $('#score').text(currentScore)
    }
    function vennLogicize(){
      currentScore = 0
      var diagramSize = Math.min($('#vennLog').width(),window.innerHeight*0.8)
      logicizeChart = venn.VennDiagram().height(diagramSize).width(diagramSize)
      canvasL = d3.select('#vennLog')
      var obj = [

      ]
      var objI
      var ansButstatus = "answer"
      var currentProblem;
      var setsL
      var vennL
      var mode = "shade"
      initVennL()

      answer = d3.select('#answer')
      exBut = d3.select('#exBut')
      exBut2 = d3.select('#exBut2')
      premise1 = d3.select('#sylProblem').append('p').attr('id','p1')
      premise2 = d3.select('#sylProblem').append('p').attr('id','p2')
      conclusion = d3.select('#sylProblem').append('p').attr('id','con')
      answer.on('click',function(){
        console.log(obj)
        if (ansButstatus == "answer"){
          var answerArea = {

          }
          areaCorrect = true
          for (object in setsL){
            var tempSets = setsL[object].sets
            // console.log("id " + object + " l:" +tempSets.length)

              var objStr = tempSets[0]
              if (tempSets.length > 1) objStr += "_"+tempSets[1]
              if (tempSets.length > 2) objStr += "_"+tempSets[2]

            answerArea[objStr] = setsL[object].clicked
            if (answerArea[objStr] != currentProblem.diagram.area[objStr]) areaCorrect = false
          }
          objAnswer = (obj.sort()[0] == currentProblem.diagram.objects.sort()[0] && obj.sort()[1] == currentProblem.diagram.objects.sort()[1]) ? true :false;
          if (objAnswer&&areaCorrect) {
            currentScore+= 1;
            ansButstatus = "next"
          } else{
            currentScore = 0
            ansButstatus = "next"
          }
        }else if (ansButstatus == "next" ){
          // $('#vennArgument').css('min-height',$('#vennArgument').height())
          diagramSize = Math.min($('#vennLog').width(),window.innerHeight*0.8)
          logicizeChart = venn.VennDiagram().height(diagramSize).width(diagramSize)
          canvasL.select('svg').remove()
          initVennL()
          canvasL.transition().style('opacity',0).transition().style('opacity',1)

          obj = []
          exBut.text('Add Object 1')
          exBut.text('Add Object 2')
          ansButstatus = "answer"
        }
        console.log(ansButstatus)
      updateScore()
      console.log("obj " + objAnswer)
      console.log("area " +areaCorrect)


      })




      exBut.on('click',function(){
        if (mode =="shade"){
          objI = 0;
          mode = "obj1"
           $('#delObj').removeClass('invisible')
          $('#exBut').removeClass('btn-outline-teal')
          $('#exBut').addClass('btn-teal')
          $('#exBut').text('Confirm Object 1')

        }else if (mode == "obj2"){
          objI = 0;
          mode = "obj1"
          $('#exBut').removeClass('btn-outline-teal')
          $('#exBut').addClass('btn-teal')
          $('#exBut').text('Confirm Object 1')
          $('#exBut2').removeClass('btn-blue')
          $('#exBut2').addClass('btn-outline-blue')
          $('#exBut2').text('Edit Object 1')
        }
        else {
          mode = "shade"
          $('#delObj').addClass('invisible')
          $('#exBut').removeClass('btn-teal')
          $('#exBut').addClass('btn-outline-teal')
          $('#exBut').text('Edit Object 1')
        }


      })
      exBut2.on('click',function(){
        if (mode =="shade"){
          objI = 1;
          mode = "obj2"
           $('#delObj').removeClass('invisible')
          $('#exBut2').removeClass('btn-outline-blue')
          $('#exBut2').addClass('btn-blue')
          $('#exBut2').text('Confirm Object 2')
        }
        else if (mode == "obj1"){
          objI = 1;
          mode = "obj2"
          $('#exBut2').removeClass('btn-outline-blue')
          $('#exBut2').addClass('btn-blue')
          $('#exBut2').text('Confirm Object 2')
          $('#exBut').removeClass('btn-teal')
          $('#exBut').addClass('btn-outline-teal')
          $('#exBut').text('Edit Object 1')

        }
        else {
          mode = "shade"
          $('#delObj').addClass('invisible')
          $('#exBut2').removeClass('btn-blue')
          $('#exBut2').addClass('btn-outline-blue')
          $('#exBut2').text('Edit Object 2')
        }

      })
      function initVennL(){

        loadSyl( function(error, dogs){

          premise1.text("Premise 1: "+dogs.p1str)
          premise2.text("Premise 2: "+dogs.p2str)
          conclusion.text("Conclusion: "+dogs.cstr)
          console.log(dogs)
          currentProblem = dogs

          var cross = {}


          var a = dogs.terms.m
          var b = dogs.terms.p
          var c = dogs.terms.s
          terms = {
            a:a,
            b:b,
            c:c
          }
          var  cCenter = a+"_"+b+"_"+c
          var  cRight = "-" + a+"_"+b+"_"+c
          var  cLeft = a+"-"+b+"_"+c
          var  cBottom = a+"_"+b+"-"+c
          setsL = [
            {sets: [a], size: 4,clicked:false},
           {sets: [b], size: 4,clicked:false},
           {sets: [c], size: 4,clicked:false},
           {sets: [a,b], size: 1,clicked:false},
           {sets: [a,c], size: 1,clicked:false},
           {sets: [b,c], size: 1,clicked:false},
           {sets: [a,b,c], size: 1,clicked:false},

          ]



          vennL = canvasL.datum(setsL).call(logicizeChart)






          delBut = d3.select('#delObj')


          vennL.selectAll('path').style('fill','white')    .style('stroke', "black")
              .style('stroke-opacity',1)
              .style('stroke-width',5)
              .style('fill-opacity',1)




          delBut.on('click',function(){
            if (cross[objI]){
              obj.splice(objI, 1);
              cross[objI].attr('d',"M -1000 -1000")
            }

            mode = "shade"
            var targetBut = (objI == 0)? '#exBut' :'#exBut2'
            var color = (objI == 0)? 'teal' :'blue'
            $(targetBut).removeClass('btn-'+color)
            $(targetBut).addClass('btn-outline-'+color)
            $(targetBut).text('Add Object ' + (objI + 1))
            $('#delObj').addClass('invisible')



          })
          function getCrossLoc(dim,direction){

            var crossStr = "m 10 10 l -20 -20 m 10 10 m -10 10 l 20 -20"
            cir ={}
            cir.cx = parseFloat(dim.split(' ')[1])
            cir.cy = parseFloat(dim.split(' ')[2])
            cir.ab = (parseFloat(dim.split(' ')[10]) - cir.cy)/3
            cir.radius = parseFloat(dim.split(' ')[4]) *-1

            // console.log("M " + $('#vennLog svg').width()/2 + " " + $('#vennLog svg').height()/2   + " " + crossStr)
            if (direction == cRight) direction = "right"
            else if (direction == cLeft) direction = "left"
            else if (direction == cBottom) direction = "bottom"
            else if (direction == cCenter) return "M " + $('#vennLog svg').width()/2 + " " + $('#vennLog svg').height()/2   + " " + crossStr
            else if (direction == a +"_"+b) return "M " +cir.cx + " " + cir.cy  + " m 0 " +cir.ab + " "+ crossStr
            else if (direction == a +"_"+c || direction == b +"_"+c ) return "M " +cir.cx + " " + cir.cy  + " m 0 -" +(cir.radius/2) + " "+ crossStr
            else if (direction == "+" + a +"_"+c ||direction =="+" + b +"_"+c) return "M " +cir.cx + " " + cir.cy  + " m 0 -" + cir.radius + " " + crossStr
            else if (direction == "+" + a +"_"+b ||direction =="-" + a +"_"+b) return (direction == "+" + a +"_"+b)? "M " +cir.cx + " " + cir.cy  + " m " + cir.radius +" 0 "+ " " + crossStr :  "M " +cir.cx + " " + cir.cy  + " m -" + cir.radius +" 0 "+ " " + crossStr
            else if (direction == "-"+a+"_"+c) return "M " +cir.cx + " " + cir.cy + " m -" +  cir.radius + " " + Math.sqrt(cir.radius*cir.radius - cir.radius * cir.radius) +" "+ crossStr
            else if (direction == "-"+b+"_"+c) return "M " +cir.cx + " " + cir.cy + " m " +  cir.radius + " " + Math.sqrt(cir.radius*cir.radius - cir.radius * cir.radius) +" "+ crossStr
            else return "M " +cir.cx + " " + cir.cy  + " " + crossStr
            // console.log(dim.split(' '))


            cir.left = "M " +cir.cx + " " + cir.cy + " m -" + Math.sqrt(cir.radius*cir.radius - cir.radius/2 * cir.radius/2) + " -" +  cir.radius/2 + " " + crossStr

            cir.right = "M " +cir.cx + " " + cir.cy + " m " + Math.sqrt(cir.radius*cir.radius - cir.radius/2 * cir.radius/2) + " -" +  cir.radius/2 + " " + crossStr

            cir.bottom = "M " +cir.cx + " " + cir.cy + " m 0 "    +  cir.radius + " " + crossStr

            // console.log("output " + str)


            return cir[direction]

            // d= "M 588.2238280114467 237.25892100262183 m 192.55 -111  m 20 20 l -40 -40 m 20 20 m -20 20 l 40 -40"
          }
          vennL.selectAll("g")
            .on("click", function(d, i) {

              if (mode=="shade"){
                if (!d.clicked){
                  d3.select(this).select('path').style('fill','#ccc').style('fill-opacity',1)
                  d.clicked = true

                }else{
                  d3.select(this).select('path').style('fill','white').style('fill-opacity',1)
                  d.clicked = false
                }
              } else if (mode!="shade"){
                var dim
              switch(d.sets.length){
                case (3): {
                    centerLoop ={

                    }
                    centerLoop[cCenter] =  cLeft
                    centerLoop[cLeft] =  cRight
                    centerLoop[cRight] =  cBottom
                    centerLoop[cBottom] =  cCenter
                    // console.log(centerLoop)
                    if (obj[objI]== cLeft || obj[objI]== cRight|| obj[objI]== cBottom||obj[objI]== cCenter)  obj[objI] = centerLoop[obj[objI]]
                    else  obj[objI] = cCenter
                    // console.log(obj)
                    if (obj[objI] == cRight) dim = vennL.select('g[data-venn-sets="'+a+'"]  path').attr('d')
                    else if (obj[objI] == cLeft) dim =  vennL.select('g[data-venn-sets="'+b+'"]  path').attr('d')
                    else if (obj[objI] == cBottom) dim = vennL.select('g[data-venn-sets="'+c+'"]  path').attr('d')
                    else dim = "0"
                    // console.log(dim)
                    // dim = (obj[objI]==a+"_"+b"_"+"_"+c)? "0" :vennL.select('g[data-venn-sets="'+terms[obj[objI]]+'"]  path').attr('d')
                    break;

                  }
                  case (2):{
                    if (obj[objI] ==  d.sets[0]+"_"+d.sets[1]) obj[objI] = "-"+ d.sets[0]+"_"+d.sets[1]
                    else obj[objI] = (obj[objI] ==  "-"+ d.sets[0]+"_"+d.sets[1]) ? obj[objI] = "+"+ d.sets[0]+"_"+d.sets[1]:  obj[objI] =  d.sets[0]+"_"+d.sets[1]


                    if (obj[objI] == a+"_"+b) dim = vennL.select('g[data-venn-sets="'+obj[objI]+'"]  path').attr('d')
                    else if (obj[objI] == a+"_"+c || obj[objI] == "+" + a+"_"+c || obj[objI] == "+" + a+"_"+b ) dim = vennL.select('g[data-venn-sets="'+a+'"]  path').attr('d')
                    else if (obj[objI] == b + "_" + c|| obj[objI] == "+"+b + "_" + c|| obj[objI] == "-" + a+"_"+b ) dim = vennL.select('g[data-venn-sets="'+b+'"]  path').attr('d')
                    else dim = vennL.select('g[data-venn-sets="'+c+'"]  path').attr('d')
                    // console.log(dim)
                    // console.log(obj[objI])

                    break;

                  }
                  case (1): {
                    obj[objI] =  d.sets[0]
                    dim = vennL.select('g[data-venn-sets="'+obj[objI]+'"]  path').attr('d')
                    // console.log(obj[objI])
                    break;
                  }

                }
                // console.log(obj)
                var crossColor = (objI == 1)? "#478EB0" :"#028482"
                if(cross[objI] == undefined){
                  cross[objI] = canvasL.select('svg').append('path').attr('d',getCrossLoc(dim,obj[objI])).style('stroke',crossColor)
                      .style('stroke-opacity',.7)
                      .style('stroke-width',7)
                      .style('fill-opacity',1)
                } else{
                  cross[objI].transition().duration(300).attr('d',getCrossLoc(dim,obj[objI]))
                }
              }
            })
            .on('mouseover',function(){
              var hoverColor = "#9FB3B6"
              if (mode =="shade") {
                 d3.select(this).select('path').transition().style('fill',hoverColor)
              } else {
                d3.select(this).select('path').style('stroke',hoverColor)
              }
            })
            .on('mouseout',function(d){
              if (mode =="shade"){
                var tempColor = (!d.clicked)? "white":"#ccc";
                d3.select(this).select('path').transition().style('fill',tempColor)
              } else{
                d3.select(this).select('path').style('stroke','black')

              }
            })
            // console.log(test = new Syllogism(a,b,c))
            // console.log(test)
        })
      }
    }
  vennLogicize()

  function loadSyl(callback){
    jQuery.post("../processing/syllogism")
    .done(function(data){
        callback(null, data);
    }).fail(function(){$body.append('Failed to Load Quiz')})
  };

  loadSyl(function(e,d){
    // console.log(d)
  })


})

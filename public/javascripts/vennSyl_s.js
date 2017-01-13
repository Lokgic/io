var venn = require("venn.js")
var objMessage = 'Click on the corresponding area on the Venn diagram to place an cross. Clicking on the overlapping repeatedly will toggle between borders. Click the same button again to go back shading mode. Click "Delete current object" to remove the cross.'
$.notify.defaults({
  globalPosition: 'bottom left',
  style:"info"
})
var notifyLoc = "#logicizeNav"
var notifyDir = "bottom-center"

function endMessage(title, body){
  $('#messageModal .modal-header').text(title)
  $('#messageModal .modal-body').html("")
  $('#messageModal .modal-body').text(body)
  $('#messageModal').modal()
}




$(function(){
  var crossStr = "m 10 10 l -20 -20 m 10 10 m -10 10 l 20 -20"
  function showInstruction(){
    $('#messageModal .modal-header').text("Tutorial")
    $('#messageModal .modal-body').html("")
    var a = "Dogs"
    var b = "Animals"
    var c = "German Shepherds"
    instructionSet = [
      {sets: [a], size: 4,clicked:false},
     {sets: [b], size: 4,clicked:false},
     {sets: [c], size: 4,clicked:false},
     {sets: [a,b], size: 1,clicked:false},
     {sets: [a,c], size: 1,clicked:false},
     {sets: [b,c], size: 1,clicked:false},
     {sets: [a,b,c], size: 1,clicked:false},

    ]
    $('#messageModal').modal()
    var textInst = d3.select('#messageModal .modal-body').append('p').attr('class','text-justify m-a-1').style('background-color','#9FB3B6').style('padding','10px').style('border-radius','10px')
    var argument = d3.select('#messageModal .modal-body').append('p').attr('class','text-xs-center m-a-1').style('background-color','#9FB3B6').style('padding','10px').style('border-radius','10px')

    d3.select('#messageModal .modal-body').append('div').attr('class','modalVenn text-xs-center')
    var iWidth = 450
    var instructionChart = venn.VennDiagram().height(iWidth).width(iWidth)
    // console.log(iWidth)
    var intro = "The goal of this 'logicize' (basically a logic exercise) is to determine whether a given categorical syllogism is valid by providing a correct Venn diagram representation of it."
    argument.text("Click on the circle below to continue and click outside of the window anytime to exit. You can always reopen this window by clicking the 'Instruction' button.")
    textInst.text(intro)
    var introSet = [
      {sets: [a], size: 1},
     {sets: [b], size: 1},
     {sets: [c], size: 1},
     {sets: [a,b], size: 1},
     {sets: [a,c], size: 1},
     {sets: [b,c], size: 1},
     {sets: [a,b,c], size: 1},

    ]
    var slide = 1;
    var iVenn = d3.select('#messageModal .modalVenn').datum(introSet).call(instructionChart)
    var label = iVenn.selectAll('.label').style('fill-opacity',0)
    var iButton
    iVenn.on('click', function(){
      switch (slide){
        case 1: {
          slide += 1;
          label.transition().duration(1500).style('fill-opacity',1)
          iVenn.datum(instructionSet).call(instructionChart)
          iVenn.selectAll('path').style('fill','white')
              .style('stroke', "black")
              .style('stroke-opacity',1)
              .style('stroke-width',5)
              .style('fill-opacity',1)
            textInst.text("Consider the follow argument. All dogs are animals. Some animals are German Shepherds. Therefore, some dogs are German Shepherds. ")
            argument.text("Is it valid? It sounds plausible. To begin, these statements are all true - let's complete a Venn diagram to find out. Click on the Venn diagram to continue.")
            break;
        }
        case 2: {
          argument.text("")
          slide +=1;
          textInst.text("The first statement says that all dogs are animals. This means that we should fill with grey the area of the dog circle that doesn't overlap with the animal circle, signifying that no non-animal dog exists.")
          argument.text("Click on the corresponding areas to shade them. The tutorial will continue as soon as all of the needed areas are shaded.")
          // iButton.text('See Instruction')
          var a = "Dogs"
          var button = [true,true]
          iVenn.select('g[data-venn-sets="'+a+'"]').on('click',function(){
            if (button[0]){
              d3.select(this).select('path').transition().duration(600).style('fill','grey')
              slide += 1;
              button[0] = false
            }

          })


          iVenn.select('g[data-venn-sets="'+a+'_German Shepherds"]').select('path').on('click',function(){
            if (button[1]){
              d3.select(this).transition().duration(600).style('fill','grey')
              slide += 1;
              button[1] = false
            }

          })
          break;
        }
        case 5 :{
          var completed = false;
          slide += 1;
          textInst.text("Well done - now onto premise 2: some animals are German Shepherds. This is an existential claim, to be represented by a X in the diagram.")
          argument.text("Click on the 'Add Object' button")
          iButton = d3.select('#messageModal .modal-body').append('button').attr('class','btn btn-block btn-greyish p-a-1').text('Add Object')
          .on('click', function(){
            if (!completed){
              slide +=1
              completed = true;
              // iButton.classed('btn-greyish',false).classed('btn-outline-greyish',true)
              iButton.classed('invisible',true)
              textInst.text("Now clicking Venn diagram will place a 'X' in it instead of shading the area." )
              argument.text("Click on the corresponding area to represent the claim that something that is both a German Shepherd and an animal.")
              var iDim = iVenn.select(pickVennArea('Animals')).select(' path').attr('d')
              var iCir = getCirNum(iDim)
              var toCross =  "M " +cir.cx + " " + cir.cy  + " m 0 -" +(cir.radius/2) + " "+ crossStr
              var checkValidity = false

              iVenn.select(pickVennArea('Animals_German Shepherds')).select('path').on('click',function(){

                if (!checkValidity){
                  checkValidity = true
                  iVenn.select('svg').append('path').attr('d',toCross).style('stroke','black')
                        .style('stroke-opacity',.7)
                        .style('stroke-width',7)
                        .style('fill-opacity',1)
                  textInst.text("Good job. Now think about this means for the conclusion: Some dogs are German Shepherd. Is the argument valid? You might be tempted to say yes because the conclusion itself is true, but that's not we are asking. Remember validity means: 'IF the premises are true, the conclusion must also be true.' Choose by picking on the corresponding button.")
                  argument.text("The argument was: All dogs are animals. Some animals are German Shepherds. Therefore, some dogs are German Shepherds.")
                  var end = false;
                  iButton.classed('invisible', false).text('Valid').on('click', function(){
                    if (!end){
                      textInst.text("That's incorrect. You might be tempted to pick this because these are all true statements, but remember that validity does not ask if the statements are actually true - they just ask what would happen if these statements were true. So the fact that they all happen to be true is irrelevant - as a matter of fact, an argument can contain all false statements and can still be a valid argument. If you look at the diagram, since the only place that has 'X' is the intersection between animals and German Shepherds, and there is nothing in the premises that would reject the existence of a non-dog German Shepherd animal.")
                      argument.text("Click on either of the button or the darken area outside of this window to close the tutorial.")
                      end = true
                    }else{
                      $('#messageModal').modal('hide')
                    }
                  })
                  iButton2 = d3.select('#messageModal .modal-body').append('button').attr('class','btn btn-block btn-greyish p-a-1').text('Invalid').on('click', function(){
                    if (!end){
                      textInst.text("That's correct! Even though these are all true statements, the Venn diagram clearly shows that it is still possible for the conclusion to be false even if the premises are true.")
                      argument.text("Click on either of the button or the darken area outside of this window to close the tutorial.")
                      end = true

                    }else {
                      $('#messageModal').modal('hide')
                    }
                  })
                }
              })



              iVenn.select(pickVennArea('Animals')).select('path').on('click',function(){
              if (!checkValidity) textInst.text('Not quite - this just says that something is an animal.')
              })

              iVenn.select(pickVennArea('Dogs_Animals')).select('path').on('click',function(){
              if (!checkValidity) textInst.text('This just says that some dog is an animal. This is true but it does not capture that the premise is saying.')

              })

              iVenn.select(pickVennArea('Dogs_German Shepherds')).select('path').on('click',function(){

              if (!checkValidity) textInst.text('This just says that some dogs is a German Shepherd. This is true but it does not capture that the premise is saying. This is close though since the premise does talk about German Shepherds.')
              })

              iVenn.select(pickVennArea('German Shepherds')).select('path').on('click',function(){
              if (!checkValidity) textInst.text('This just says that something is a German Shepherd. This is very close though since the premise does talk about German Shepherds.')

              })

              iVenn.select(pickVennArea('Dogs_Animals_German Shepherds')).select('path').on('click',function(){
                if (!checkValidity) textInst.text('This is saying a little more than what the premise is saying - it does not talk about anything being a dog in particular.')

              })

              iVenn.select(pickVennArea('Dogs')).select('path').on('click',function(){
                if (!checkValidity) textInst.text('This just says that something is a dog.')

              })


            }




        })
          break
        }

      }


    })
    function nextS(){
      slide +=1
    }
    function pickVennArea(a){
      return 'g[data-venn-sets="'+a+'"]'
    }

  }

  showInstruction()
  // $.notify('Correct! Press submit again to continue.');
  d3.select('#tutorial').on('click',function(){
    showInstruction()
  })

  var currentScore ;

  function getCirNum(dim){
    cir = {}
    cir.cx = parseFloat(dim.split(' ')[1])
    cir.cy = parseFloat(dim.split(' ')[2])
    cir.ab = (parseFloat(dim.split(' ')[10]) - cir.cy)/3
    cir.radius = parseFloat(dim.split(' ')[4]) *-1
    return cir
  }
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
      var valid;

      initVennL()

      answer = d3.select('#answer')
      exBut = d3.select('#exBut')
      exBut2 = d3.select('#exBut2')
      validBut = d3.select('#valid')
      premise1 = d3.select('#sylProblem').append('p').attr('id','p1')
      premise2 = d3.select('#sylProblem').append('p').attr('id','p2')
      conclusion = d3.select('#sylProblem').append('p').attr('id','con')

      validBut = d3.select('#valid').on('click', function(){
        if (valid){
          valid = false
        } else{
          valid = true
        }
        var toWrite = (valid)? "Argument Valid": "Argument Invalid"
        var toFill = (valid)? "#478EB0": "#763626"
        validBut.text(toWrite).style('color',toFill)
      })

      answer.on('click',function(){
        // console.log(obj)
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

          var validAnswer = (valid ==currentProblem.valid)
          console.log(validAnswer)
          if (objAnswer&&areaCorrect&&validAnswer) {
            // console.log(validAnswer)
            currentScore+= 1;
            ansButstatus = "next"
            $.notify('Correct! Press submit again to continue.', {
            style: 'correctblue',
            position: notifyDir
          });

          } else{
            endMessage("Logicize Result", "Your score is " + currentScore +".")
            currentScore = 0
            nextProblem();
          }
        }else if (ansButstatus == "next" ){
          nextProblem()
        }
        // console.log(ansButstatus)
      updateScore()
      // console.log("obj " + objAnswer)
      // console.log("area " +areaCorrect)


      })



      exBut.on('click',function(){
        if (mode =="shade"){

          objI = 0;
          mode = "obj1"
           $('#delObj').removeClass('invisible')
          $('#exBut').removeClass('btn-outline-red')
          $('#exBut').addClass('btn-red')
          $.notify(objMessage)
          // $('#exBut').text('Confirm Object 1')

        }else if (mode == "obj2"){
          objI = 0;
          mode = "obj1"
          $.notify(objMessage)
          $('#exBut').removeClass('btn-outline-red')
          $('#exBut').addClass('btn-red')
          // $('#exBut').text('Confirm Object 1')
          $('#exBut2').removeClass('btn-blue')
          $('#exBut2').addClass('btn-outline-blue')
          // $('#exBut2').text('Edit Object 1')
        }
        else {
          mode = "shade"
          $('#delObj').addClass('invisible')
          $('#exBut').removeClass('btn-red')
          $('#exBut').addClass('btn-outline-red')
          // $('#exBut').text('Edit Object 1')
        }


      })
      exBut2.on('click',function(){
        if (mode =="shade"){
          objI = 1;
          mode = "obj2"
           $('#delObj').removeClass('invisible')
          $('#exBut2').removeClass('btn-outline-blue')
          $('#exBut2').addClass('btn-blue')
          $.notify(objMessage)

          // $('#exBut2').text('Confirm Object 2')
        }
        else if (mode == "obj1"){
          objI = 1;
          mode = "obj2"
          $('#exBut2').removeClass('btn-outline-blue')
          $('#exBut2').addClass('btn-blue')
          // $('#exBut2').text('Confirm Object 2')
          $('#exBut').removeClass('btn-red')
          $('#exBut').addClass('btn-outline-red')
          $.notify(objMessage)

          // $('#exBut').text('Edit Object 1')

        }
        else {
          mode = "shade"
          $('#delObj').addClass('invisible')
          $('#exBut2').removeClass('btn-blue')
          $('#exBut2').addClass('btn-outline-blue')
          // $('#exBut2').text('Edit Object 2')
        }

      })

      function nextProblem(){
        diagramSize = Math.min($('#vennLog').width(),window.innerHeight*0.8)
        logicizeChart = venn.VennDiagram().height(diagramSize).width(diagramSize)
        canvasL.select('svg').remove()
        initVennL()
        canvasL.transition().style('opacity',0).transition().style('opacity',1)
        validBut.text("Argument valid?")
        valid = ""
        obj = []
        ansButstatus = "answer"
      }
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
            var color = (objI == 0)? 'red' :'blue'
            $(targetBut).removeClass('btn-'+color)
            $(targetBut).addClass('btn-outline-'+color)
            $(targetBut).text('Object ' + (objI + 1))
            $('#delObj').addClass('invisible')



          })


          function getCrossLoc(dim,direction){
            // console.log(dim)
            // console.log(direction)
            // var crossStr = "m 10 10 l -20 -20 m 10 10 m -10 10 l 20 -20"
            // cir ={}
            // cir.cx = parseFloat(dim.split(' ')[1])
            // cir.cy = parseFloat(dim.split(' ')[2])
            // cir.ab = (parseFloat(dim.split(' ')[10]) - cir.cy)/3
            // cir.radius = parseFloat(dim.split(' ')[4]) *-1
            cir = getCirNum(dim)
            // console.log("M " + $('#vennLog svg').width()/2 + " " + $('#vennLog svg').height()/2   + " " + crossStr)
            if (direction == cRight) direction = "right"
            else if (direction == cLeft) direction = "left"
            else if (direction == cBottom) direction = "bottom"
            else if (direction == cCenter) return "M " + $('#vennLog svg').width()/2 + " " + $('#vennLog svg').height()/2   + " " + crossStr
            else if (direction == a +"_"+b) return "M " +cir.cx + " " + cir.cy  + " m 0 " +cir.ab + " "+ crossStr
            else if (direction == a +"_"+c || direction == b +"_"+c ) return "M " +cir.cx + " " + cir.cy  + " m 0 -" +(cir.radius/2) + " "+ crossStr
            else if (direction == "+" + a +"_"+c ||direction =="+" + b +"_"+c) return "M " +cir.cx + " " + cir.cy  + " m 0 -" + cir.radius + " " + crossStr
            else if (direction == "+" + a +"_"+b ||direction =="-" + a +"_"+b){
              result = (direction == "+" + a +"_"+b)? "M " +cir.cx + " " + cir.cy  + " m " + cir.radius +" 0 "+ " " + crossStr :  "M " +cir.cx + " " + cir.cy  + " m -" + cir.radius +" 0 "+ " " + crossStr
              return result
            }
            else if (direction == "-"+a+"_"+c) return "M " +cir.cx + " " + cir.cy + " m -" +  cir.radius/1.5 + " " + Math.sqrt(cir.radius*cir.radius - cir.radius/1.5 * cir.radius/1.5) +" "+ crossStr
            else if (direction == "-"+b+"_"+c) return "M " +cir.cx + " " + cir.cy + " m " +  cir.radius/1.5 + " " + Math.sqrt(cir.radius*cir.radius - cir.radius/1.5 * cir.radius/1.5) +" "+ crossStr
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
                  d3.select(this).select('path').style('fill','#9FB3B6').style('fill-opacity',1)
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
                var crossColor = (objI == 1)? "#478EB0" :"#EC5A57"
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
              var hoverColor = "#ccc"
              if (mode =="shade") {
                 d3.select(this).select('path').transition().style('fill',hoverColor)
              } else {
                d3.select(this).select('path').style('stroke',hoverColor)
              }
            })
            .on('mouseout',function(d){
              if (mode =="shade"){
                var tempColor = (!d.clicked)? "white":"#9FB3B6";
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

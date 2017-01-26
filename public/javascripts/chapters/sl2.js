$(function(){
  //negation
  neg = [
      {
        "name":"$A$",
        "column":["T","F"]
      },
      {
        "name":"$\\neg A$",
        "column":["F","T"]
      }
    ]

    con = [
        {
          "name":"$A$",
          "column":["T","T","F","F"]
        },
        {
          "name":"$B$",
          "column":["T","F","T","F"]
        },
        {
          "name":"$A \\wedge B$",
          "column":["T","F","F","F"]
        }
      ]

      dis = [
          {
            "name":"$A$",
            "column":["T","T","F","F"]
          },
          {
            "name":"$B$",
            "column":["T","F","T","F"]
          },
          {
            "name":"$A \\vee B$",
            "column":["T","T","T","F"]
          }
        ]

       sl_2_6a = [
         {
           "name":"$H$",
           "column":["T","T","F","F"]
         },
         {
           "name":"$I$",
           "column":["T","F","T","F"]
         },
         {
           "name":"$(H$",
           "column":["T","T","F","F"]
         },
         {
           "name":"$\\wedge$",
           "column":["","","",""]
         },
         {
           "name":"$I)$",
           "column":["T","F","T","F"]
         },
         {
           "name":"$\\vee$",
           "column":["","","",""]
         },
         {
           "name":"$\\neg$",
           "column":["","","",""]
         },
         {
           "name":"$H$",
           "column":["T","T","F","F"]
         }
       ]

       sl_2_6b = [
         {
           "name":"$H$",
           "column":["T","T","F","F"]
         },
         {
           "name":"$I$",
           "column":["T","F","T","F"]
         },
         {
           "name":"$(H$",
           "column":["T","T","F","F"]
         },
         {
           "name":"$\\wedge$",
           "column":["T","F","F","F"]
         },
         {
           "name":"$I)$",
           "column":["T","F","T","F"]
         },
         {
           "name":"$\\vee$",
           "column":["","","",""]
         },
         {
           "name":"$\\neg$",
           "column":["","","",""]
         },
         {
           "name":"$H$",
           "column":["T","T","F","F"]
         }
       ]

       sl_2_6e = [
           {
             "name":"$H$",
             "column":["T","T","F","F"]
           },
           {
             "name":"$I$",
             "column":["T","F","T","F"]
           },
           {
             "name":"$(H \\wedge I) \\vee \\neg H$",
             "column":["T","F","T","T"]
           }
         ]

       sl_2_6c = sl_2_6b
       sl_2_6c[6].column = ["F","F","T","T"]
       sl_2_6d = sl_2_6c
       sl_2_6c[5].column = ["T","F","T","T"]







  tabulate(neg,"#negation")
  tabulate(con,"#conjunction")
  tabulate(dis,"#disjunction")
  tabulate(sl_2_6a,'#sl-2-6a')
  tabulate(sl_2_6b,'#sl-2-6b')
  tabulate(sl_2_6c,'#sl-2-6c')
  tabulate(sl_2_6d,'#sl-2-6d')
  tabulate(sl_2_6e,'#sl-2-6e')
  var a = new slSentence("A",false,and,"B",false)
  var b = new slSentence(a,true,and,"C",false)
  // console.log(typeof s == "object")
  // console.log(evaluateSL({"A":true,"B":true},b))
  tabulate(makeTruthTable(["A","B","C"],b), "#sl-2-6f")


  makeDefMatch("sl-2-def")

  function complexEngQuiz(eventID){
    var toComplete
    var data
    var next = d3.select('.nextbutt')
    next.on('click',function(d){
      var state = d3.select(this).attr('data')
      if (state == "intro"){

        jQuery.post("/processing/truthTable/slEnglish")
        .done(function(dd){
          toComplete = dd.length
          d3.select('#'+eventID).select('.problemnumdisplay').text(toComplete)
          data = dd
            makeMC(data,eventID)
            next.attr('data','answer')
            d3.select('.'+eventID+'offScreen').classed('offScreen',false).classed('currentMC',true)
            var current = data.shift()
            // current = current[0]
            var buttData = []
            current.choices.forEach(function(k){
              var obj = {
                text:"$"+k+"$",
                data:k
              }
              buttData.push(obj)
            })
            var buttons = makeMCChoices(buttData,eventID)
            // console.log(buttons)
            buttons.on('click',function(d){
              if (d.data == current.answer){
                alert("Correct! Press 'Next' to contniue","correctblue")
              }else{
                alert("Incorrect! Press 'Next' to contniue","incorred")
              }
              toComplete -=1;
              (toComplete != 0)? next.attr('data','next') :next.attr('data','over');
              d3.select('#'+eventID).select('.problemnumdisplay').text(toComplete)
              buttons.classed('invisible',true)
            })
            mathJax.reload(eventID)
        }).fail()
      }else if (state == "next"){
        d3.select('.currentMC').remove()
        // console.log(data)
        makeMC(data,eventID)
        next.attr('data','answer')
        d3.select('.'+eventID+'offScreen').classed('offScreen',false).classed('currentMC',true)
        var current = data.shift()
        // current = current[0]
        var buttData = []
        current.choices.forEach(function(k){
          var obj = {
            text:"$"+k+"$",
            data:k
          }
          buttData.push(obj)
        })
        // console.log(buttData)
        var buttons = makeMCChoices(buttData,eventID)


        buttons.classed('invisible',false).on('click',function(d){
          if (d.data == current.answer){
            alert("Correct! Press 'Next' to contniue","correctblue")
          }else{
            alert("Incorrect! Press 'Next' to contniue","incorred")
          }
          toComplete -=1;
          (toComplete != 0)? next.attr('data','next') :next.attr('data','over');
          d3.select('#'+eventID).select('.problemnumdisplay').text(toComplete)
          buttons.classed('invisible',true)
        })
        mathJax.reload(eventID)
      }


    })
  }

 complexEngQuiz('sl-2-4')

})

$(function(){

  textInputInit();
  //
  // d3.select('#sl-4-3Butt').on('click',function(d){
  //   var response = document.getElementById("sl-4-3textArea").value
  //   var attempt = {
  //     uid:uid,
  //     pid:"sl-4-3",
  //     type:"textInput",
  //     input: response,
  //     correct:null
  //   }
  //   if (response == "" || response == null) alert('A response is required.',"important")
  //   else {
  //     sendAttempts(attempt);
  //     d3.select('#sl-4-3Butt').remove()
  //     d3.select('#sl-4-3textArea').remove()
  //     d3.select('#sl-4-3').append('p').text('Your answer: ' + response)
  //
  //   }
  // })

  var conditional = [
      {
        "name":"$A$",
        "column":["T","T","F","F"]
      },
      {
        "name":"$B$",
        "column":["T","F","T","F"]
      },
      {
        "name":"$A \\to B$",
        "column":["T","F","T","T"]
      }
    ]

    tabulate(conditional,"#materialconditional")


    var biconditional = [
        {
          "name":"$A$",
          "column":["T","T","F","F"]
        },
        {
          "name":"$B$",
          "column":["T","F","T","F"]
        },
        {
          "name":"$A \\to B$",
          "column":["T","F","F","T"]
        }
      ]

      tabulate(biconditional,"#biconditional")

      var biconditional = [
          {
            "name":"$A$",
            "column":["T","T","F","F"]
          },
          {
            "name":"$B$",
            "column":["T","F","T","F"]
          },
          {
            "name":"$A \\to B$",
            "column":["T","F","F","T"]
          }
        ]

        var unless = [
            {
              "name":"$W$",
              "column":["T","T","F","F"]
            },
            {
              "name":"$O$",
              "column":["T","F","T","F"]
            },
            {
              "name":"$\\neg W \\to O$",
              "column":["T","T","T","F"]
            }
          ]
  tabulate(unless,"#unless")


})

$(function(){

  textInputInit();


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
  makeDefMatch("sl-4-matching")
  mathJax.reload()


})

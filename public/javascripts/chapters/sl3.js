$(function(){
  //negation
  var tautology = [
      {
        "name":"$A$",
        "column":["T","F"]
      },
      {
        "name":"$A \\vee \\neg A$",
        "column":["T","T"]
      }
    ]
    console.log('wtf')


    tabulate(tautology,"#tautology")


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
          "name":"($A \\wedge B)\\wedge \\neg A$",
          "column":["F","F","F","F"]
        }
      ]
  tabulate(con,"#contradiction")
      contingent = [
          {
            "name":"$A$",
            "column":["T","T","F","F"]
          },
          {
            "name":"$B$",
            "column":["T","F","T","F"]
          },
          {
            "name":"$A \\vee (B\\wedge A)$",
            "column":["T","T","F","F"]
          }
        ]

        tabulate(contingent,"#contingent")

       equiv = [
         {
           "name":"$A$",
           "column":["T","T","F","F"]
         },
         {
           "name":"$B$",
           "column":["T","F","T","F"]
         },
         {
           "name":"$\\neg (A \\vee B)$",
           "column":["F","F","F","T"]
         },
         {"name":"$\\neg A \\wedge \\neg B$",
         "column":["F","F","F","T"]
       }
       ]

       tabulate(equiv, "#equiv")

       dn = [
           {
             "name":"$A$",
             "column":["T","F"]
           },
           {
             "name":"$\\neg \\neg A$",
             "column":["T","F"]
           }
         ]

         tabulate(dn,"#dn")

       validExample =  [
         {
           "name":"$J$",
           "column":["T","T","F","F"]
         },
         {
           "name":"$E$",
           "column":["T","F","T","F"]
         },
         {
           "name":"$((E \\wedge J) \\vee J)$",
           "column":["T","T","F","F"]
         },
         {"name":"$((J\\vee J) \\vee E)$",
         "column":["T","T","T","F"]
       },
       {"name":"$\\therefore ((J \\vee \\neg E)\\vee \\neg E)$",
       "column":["T","T","F","T"]
     }
       ]

       tabulate(validExample,"#validExample")
       makeDefMatch("sl-3-def")

        makeCategory({eventId : "sl-3-cat",shuffle:true})

    
 mathJax.reload()
})

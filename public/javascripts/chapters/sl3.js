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

      //   var sl_2_6c = []
      //  for (col in sl_2_6b){
      //    (col != 6)? sl_2_6c.push(sl_2_6b[col]): sl_2_6c.push({
      //      "name":"$\\neg$",
      //      "column":["F","F","T","T"]});
      //  }
       //
       //
      //  var sl_2_6d = []
      //  for (col in sl_2_6c){
      //    (col != 5)? sl_2_6d.push(sl_2_6c[col]): sl_2_6d.push({
      //      "name":"$\\vee$",
      //      "column":["T","F","T","T"]
      //    } )
      //  }
      //  sl_2_6c = sl_2_6b
      // //  sl_2_6c[6].column = ["F","F","T","T"]
      //  sl_2_6d = sl_2_6c
      //  sl_2_6c[5].column = ["T","F","T","T"]






 //
 //  tabulate(neg,"#negation")
 //  tabulate(con,"#conjunction")
 //  tabulate(dis,"#disjunction")
 //  tabulate(sl_2_6a,'#sl-2-6a')
 //  tabulate(sl_2_6b,'#sl-2-6b')
 //  tabulate(sl_2_6c,'#sl-2-6c')
 //  tabulate(sl_2_6d,'#sl-2-6d')
 //  tabulate(sl_2_6e,'#sl-2-6e')
 //  var a = new slSentence("A",false,and,"B",false)
 //  var b = new slSentence(a,true,and,"C",false)
 //  // console.log(typeof s == "object")
 //  // console.log(evaluateSL({"A":true,"B":true},b))
 //  tabulate(makeTruthTable(["A","B","C"],b), "#sl-2-6f")
 //
 //
 //  makeDefMatch("sl-2-def")
 //
 //
 // // mcQuiz('sl-2-4','/processing/truthTable/slEnglish')
 mathJax.reload()
})

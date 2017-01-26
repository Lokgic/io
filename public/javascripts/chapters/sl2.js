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

        var sl_2_6c = []
       for (col in sl_2_6b){
         (col != 6)? sl_2_6c.push(sl_2_6b[col]): sl_2_6c.push({
           "name":"$\\neg$",
           "column":["F","F","T","T"]});
       }


       var sl_2_6d = []
       for (col in sl_2_6c){
         (col != 5)? sl_2_6d.push(sl_2_6c[col]): sl_2_6d.push({
           "name":"$\\vee$",
           "column":["T","F","T","T"]
         } )
       }
      //  sl_2_6c = sl_2_6b
      // //  sl_2_6c[6].column = ["F","F","T","T"]
      //  sl_2_6d = sl_2_6c
      //  sl_2_6c[5].column = ["T","F","T","T"]







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


 mcQuiz('sl-2-4','/processing/truthTable/slEnglish')

})

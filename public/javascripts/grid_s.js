var Chance = require('chance')
var mathjax = require('./mods/mathjax.js')
var chance = new Chance();
var _ = require('underscore')
var some = " \\exists "
var every = " \\forall "
var and = " \\wedge "
var or = " \\vee "
var implies = " \\to "
var neq = " \\neq "
var eq = " = "
var variables = ['x', 'y', 'z', 'w', 'u', 'v', ' \\theta ', ' \\psi ']
var predicates = {
    vowel: "V",
    left: "L",
    right: "R",
    above: "A",
    under: "U",
    sameCol: "Y",
    sameRow: "X",
    consonant: "C",
    letter: "T",
    number: "N",
    even: "E",
    odd: "O"
}
var quantifiers = {
    some: some,
    every: every,
    atLeast: some,
    atMost: every
}
var score = 0;
var toPass = 5;

var connectives = {
    neq: neq,
    and: and,
    or: or,
    implies: implies
}
$(function() {

    function getTableValues(expected){
      ans = []
      for (var i = 0;i<6;i++){
        ans.push($('#'+(i+1)).children('.answer').text() == expected[i])
      }
      return ans
    }

    function newGrid(callback){
      jQuery.post("../processing/grid", function(problem) {
          console.log(problem)
          var solutions = []
          model = problem.model
          statements = problem.statements
          for (row in model.grid) {
              for (col in model.grid[row]) {
                  // console.log(row+"_"+col)
                  $("#" + row + "_" + col).text(model.grid[row][col])
              }
          }

          for (var i = 0; i < statements.length; i++){
            $('#'+(i+1)).children(".ql").text(print[statements[i][0].prefix](statements[i][0]))
            solutions.push(statements[i][1])
          }



          callback(solutions);
      });

    }


    function makeParts(s) {
        var varNeeded = s.quantifier_1


        var v = _.first(variables, varNeeded)
        var backref = variables[varNeeded]
        var subject = variables[varNeeded + 1]


        var quantifiers_ID = ""
        var property_1 = []
        var relations = []

        for (var i = 0; i < s.quantifier_1; i++) {
            x = v[i]
            quantifiers_ID += quantifiers[s.prefix] + x
            property_1.push(predicates[s.kind_1] + x)
            if (s.prefix == "atMost"){
              relations.push(predicates[s.relation] + v[i] + subject)
            }

        }

        if (s.prefix == "atLeast") relations.push(predicates[s.relation] + backref+ subject)
        quantifier_backref = every + backref
        quantifier_relations = quantifiers[s.quantifier_2] + subject
        property_2 = predicates[s.kind_2] + subject



        output = {
          quantifier_backref:quantifier_backref,
            quantifiers_ID: quantifiers_ID,
            quantifier_relations: quantifier_relations,
            property_1: property_1,
            property_2: property_2,
            relations: relations,
            v_1: v,
            subject:subject,
            backref:backref

        }
        return output;
    }


    function createEq(arrVar, e, conn, backref){


      if (backref == undefined){
        if (arrVar.length == 1) return arr[0]
        if (arrVar.length >= 2){
          output = arrVar[0] + e + arrVar[1]
        } if (arrVar.length >= 3){
          output += conn + arrVar[0] + e + arrVar[2] + conn +arrVar[1] + e +arrVar[2]
        } if (arrVar.length >= 4){
          output += conn + arrVar[0] + e + arrVar[3] + conn +arrVar[2] + e +arrVar[3]
        }
        return output
      } else{
        output = arrVar[0] + e +backref
        if (arrVar.length >= 2){
          for (var i = 1;i<arrVar.length;i++){
            output += arrVar[i] + e +backref
            }
          }
          return output;
        }
      }



    function createConnective(arrVar, connective){
      // console.log(arrVar)
      if (arrVar.length == 1) return arrVar[0]
      out = arrVar[0]
      for (var i = 1; i < arrVar.length; i++){
        out +=  connective + arrVar[i]
      }
      return out;
    }
    var print = {
        atMost: function(s) {

            parts = makeParts(s);
            // console.log(parts)
            conseq = createEq(_.union(parts.v_1, [parts.backref]), eq, or)
            qPrefix = parts.quantifiers_ID + parts.quantifier_backref + parts.quantifier_relations

            antecedent  = "("+createConnective(_.union(parts.relations, [parts.property_2], parts.property_1),and) +")"

            // console.log(conseq)
            return "$" + qPrefix+ "[" +antecedent + implies + "(" + conseq+")]$"
            // return qPrefix + "(" + parts.relations+
            // return "$" + parts.quantifiers_ID + parts.quantifier_backref + string_relationQ + "[" + string_property_1[s.prefix](parts, s) + string_relations[s.prefix](parts,s) + implies + string_neq +']'
        },
        atLeast: function(s) {

            parts = makeParts(s);

            // console.log(parts)

            if (s.quantifier_1 == 1){
              return "$" + parts.quantifiers_ID + "[" + string_neq[s.prefix](parts, s)  + string_property_1[s.prefix](parts, s)  + and + quantifiers[s.quantifier_2] + parts.subject+"("+parts.relations + and + parts.property_2 +"))]$"
            }else{
              return "$" + parts.quantifiers_ID + "[" + string_neq[s.prefix](parts, s)  + string_property_1[s.prefix](parts, s)  + and + parts.quantifier_backref+  "(" + string_backref[s.prefix](parts,s) + implies + quantifiers[s.quantifier_2] + parts.subject+"("+parts.relations + and + parts.property_2 +"))]$"
            }


        },
        exactly: function(s){
          var atLeast = {
            kind_1: s.kind_1,
            kind_2: s.kind_2,
            prefix: "atLeast",
            quantifier_1: s.quantifier_1,
            quantifier_2: s.quantifier_2,
            relation: s.relation
          }

          str = this.atLeast(atLeast)
          parts = makeParts(atLeast)
          str = str.substring(0, str.length - 2);
          varIndex = variables.indexOf(parts.subject) + 1
          backref2 = variables[varIndex]
          subject2 = variables[varIndex+1]
          str += and + every + backref2  + "("+ quantifiers[s.quantifier_2] +subject2 +"(" + predicates[s.kind_1] + backref2 + and + predicates[s.kind_2] +subject2+ and + predicates[s.relation] + backref2 + subject2 + ")" + implies + "(" + createEq(parts.v_1,eq, or, backref2) +"))]"


          return str +"$"
        }

    }

    var string_relationQ = {
        some: and,
        every: implies
    }

    var string_neq = {
        atLeast: function(parts, s) {
            if (s.quantifier_1 == 1) {
                return ""
            }
            if (s.quantifier_1 >= 2) {

                identity = "(" + parts.v_1[0] + neq + parts.v_1[1]
            }
            if (s.quantifier_1 == 3) {
                identity += and + parts.v_1[0] + neq + parts.v_1[2] + and + parts.v_1[1] + neq + parts.v_1[2]
            }
            identity += ")" + and
            return identity
        }
    }

    var string_backref = {
        atLeast: function(parts, s) {
            if (s.quantifier_1 == 1) {
                return identity = "(" + parts.v_1[0] + eq + parts.backref +')'
            }
            if (s.quantifier_1 >= 2) {

                identity = "(" + parts.v_1[0] + eq + parts.backref + or + parts.v_1[1] + eq + parts.backref
            }
            if (s.quantifier_1 == 3) {
                identity += or + parts.v_1[2] + eq + parts.backref
            }
            identity += ")"
            return identity
        }
    }

    var string_property_1 = {
        atLeast: function(parts, s) {
            switch (parts.property_1.length) {
                case 1:
                    return parts.property_1[0]
                    break;
                case 2:
                    return "(" + parts.property_1[0] + and + parts.property_1[1]+ ")";
                    break;
                case 3:
                    return "(" + parts.property_1[0] + and + parts.property_1[1] + and +parts.property_1[2]+ ")";
            }
        }
    }

    var string_relations = {
        atMost: function(parts, s){

        },
        atLeast: function(parts, s) {
            return parts.relations[0]
        }
    }

    var test = {
        prefix: 'exactly',
        quantifier_1: 3,
        kind_1: 'consonant',
        relation: 'left',
        quantifier_2: 'every',
        kind_2: 'letter'
    }

      var buttNextState = 'checkAnswer'

    newGrid(function(solutions){
        $('button').on('click', buttonFunction(solutions));
    })



    $('.answer').on('click', function() {
      if (buttNextState == 'checkAnswer'){
        if ($(this).text() == "T") {
          $(this).text("F")
          $(this).attr("value", false)
          $(this).addClass("false")
          $(this).removeClass("true")
        } else {
          $(this).text("T")
          $(this).attr("value", true)
          $(this).addClass("true")
          $(this).removeClass("false")
        }
      }
    })

    // $('#1').children(".ql").text(print[test.prefix](test))
    mathjax.reload()
    function buttonFunction(ans){

      switch (buttNextState){
      case "checkAnswer":{
        if(!_.contains(getTableValues(ans), false)){
          switch (score){
            case (toPass - 1):{
              score += 1;
              buttNextState = "startover";
              jQuery.post("/report", {moduleNo: $('title').attr('value'), label : "quiz"}, function(res){
              makeAlert($('.jumbotron'), "b", "You have passed this quiz! " + res ,1)

            });

              break;
            }
            default:  {
              score += 1;
              buttNextState = "newTable"
              console.log('corret`')

            }
          }
        } else{
          buttNextState = "startover"
          console.log('wrong')
        }
        break;
      }
      case "newTable":{
        buttNextState ="checkAnswer"
        newGrid(function(solutions){
            $('button').on('click', buttonFunction(solutions));
        })
        // currentAnswers = initTable();
            // console.log(currentAnswers)

        break;
      }
      case "startover":{
        score = 0;
        buttNextState ="checkAnswer"
        newGrid(function(solutions){
            $('button').on('click', buttonFunction(solutions));
        })
            // console.log(currentAnswers)

        break;
      }

    }}




})

$(function() {
    var some = " \\exists "
    var every = " \\forall "
    var and = " \\wedge "
    var or = " \\vee "
    var $butt = $('#gridbutt');
    var implies = " \\to "
    var neq = " \\neq "
    var eq = " = "
    var variables = ['x', 'y', 'z', 'w', 'u', 'v', ' \\lambda ', ' \\psi ']
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

    var connectives = {
        neq: neq,
        and: and,
        or: or,
        implies: implies,
        every: implies,
        some: and
    }

    var parm = {
        toPass: 15,
        logiciseCategory: "grid",
        logiciseId: "grid",
        module: "id",
        chanceLeft: 2
    }



    var tracker = new logiciseTracker(parm)
    tracker.currentProblem = {
      string: ""
    }
    tracker.enableTutorial()

    function loadGrid(callback) {
        jQuery.post("../processing/grid")
            .done(function(data) {
                callback(null, data);
            }).fail(function() {
                $body.append('Failed to Load Quiz')
            })
    };

    function printGrid(problem) {
        var solutions = []
        model = problem.model
        statements = problem.statements
        for (row in model) {
            for (col in model[row]) {
                // console.log(row+"_"+col)
                $("#" + row + "_" + col).text(model[row][col])
            }
        }

        for (var i = 0; i < statements.length; i++) {
            $('#' + (i + 1)).children(".ql").text(print[statements[i][0].prefix](statements[i][0]))
            solutions.push(statements[i][1])
        }
        mathJax.reload();
        return solutions
    }

    tracker.interaction = function() {
        me = this
        this.userInput = d3.selectAll('.answer')
        this.userInput.style('background','white')
        this.userInput.text("Click")
        this.userInput.data(this.currentAnswer)
            .enter()
        console.log(this.userInput)
        this.userInput.on('click', function(d, i) {
            if (tracker.state == 'userInput') {
                if ($(this).text() == "T") {
                    $(this).text("F")
                    me.currentChoice[i] = false
                    $(this).attr("value", false)
                    $(this).addClass("false")
                    $(this).removeClass("true")
                } else {
                    me.currentChoice[i] = true
                    $(this).text("T")
                    $(this).attr("value", true)
                    $(this).addClass("true")
                    $(this).removeClass("false")
                }
                console.log(me.currentChoice)
            }
            // me.currentChoice[i] =
        })
    }



    // tracker.drawProblem = function(){
    //   tracker.state = "userInput"
    //   var me = this
    //   tracker.state = "userInput"
    //   loadGrid(function(err, problem) {
    //       // currentAnswers = printGrid(problem)
    //       console.log(problem)
    //       currentAnswers = printGrid(problem)
    //       console.log(currentAnswers)
    //
    //
    //   })
    //
    // }
    tracker.updateStatus()
    tracker.nextProblem = function() {

        var me = this
        this.updateStatus()
        me.state = "userInput"
        me.loadProblem("", function(problem) {
            // currentAnswers = printGrid(problem)
            console.log(problem)
            me.currentAnswer = printGrid(problem)
            console.log(me.currentAnswer)
            me.currentChoice = []
            for (n in me.currentAnswer) {
                me.currentChoice[n] = null
            }
            tracker.interaction()

        })
    }

    tracker.feedback = function(){

        me.userInput.each(function(d,i){
          console.log(this)
          if (d == me.currentChoice[i]) d3.select(this).style('background','steelblue')
          else d3.select(this).style('background','red')
        })

    }
    tracker.nextProblem()
    tracker.butt.confirm.d3obj.on('click', function(d) {
        tracker.nextState()
        tracker.updateStatus()
    })

    var print = {
        atMost: function(s) {

            parts = makeParts(s);
            // console.log(parts)
            // console.log(parts)
            parts.relations.push(predicates[s.kind_1] + parts.backref)
            parts.relations.push(predicates[s.relation] + parts.backref + parts.subject)
            conseq = createEq(_.union(parts.v_1, [parts.backref]), eq, or)
            qPrefix = parts.quantifiers_ID + parts.quantifier_backref

            antecedent = "(" + parts.quantifier_relations + "("+createConnective(_.union(parts.relations, [parts.property_2], parts.property_1), and) + "))"

            // console.log(conseq)
            return "$" + qPrefix + "[" + antecedent + implies + "(" + conseq + ")]$"
            // return qPrefix + "(" + parts.relations+
            // return "$" + parts.quantifiers_ID + parts.quantifier_backref + string_relationQ + "[" + string_property_1[s.prefix](parts, s) + string_relations[s.prefix](parts,s) + implies + string_neq +']'
        },
        atLeast: function(s) {

            parts = makeParts(s);

            // console.log(parts)

            if (s.quantifier_1 == 1) {
                return "$" + parts.quantifiers_ID + "[" + string_neq[s.prefix](parts, s) + string_property_1[s.prefix](parts, s) + and + quantifiers[s.quantifier_2] + parts.subject + "(" + parts.property_2 + connectives[s.quantifier_2] + predicates[s.relation] + parts.v_1[0] + parts.subject + ")]$"
            } else {
                return "$" + parts.quantifiers_ID + "[" + string_neq[s.prefix](parts, s) + string_property_1[s.prefix](parts, s) + and + parts.quantifier_backref + "(" + string_backref[s.prefix](parts, s) + implies + quantifiers[s.quantifier_2] + parts.subject + "(" + parts.property_2 + connectives[s.quantifier_2] + parts.relations + "))]$"
            }


        },
        exactly: function(s) {
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
            subject2 = variables[varIndex + 1]
            str += and + every + backref2 + "(" + quantifiers[s.quantifier_2] + subject2 + "(" + predicates[s.kind_1] + backref2 + and + predicates[s.kind_2] + subject2 + and + predicates[s.relation] + backref2 + subject2 + ")" + implies + "(" + createEq(parts.v_1, eq, or, backref2) + "))]"


            return str + "$"
        }

    }


    function createEq(arrVar, e, conn, backref) {


        if (backref == undefined) {
            if (arrVar.length == 1) return arr[0]
            if (arrVar.length >= 2) {
                output = arrVar[0] + e + arrVar[1]
            }
            if (arrVar.length >= 3) {
                output += conn + arrVar[0] + e + arrVar[2] + conn + arrVar[1] + e + arrVar[2]
            }
            if (arrVar.length >= 4) {
                output += conn + arrVar[0] + e + arrVar[3] + conn + arrVar[2] + e + arrVar[3]
            }
            return output
        } else {
            output = arrVar[0] + e + backref
            if (arrVar.length >= 2) {
                for (var i = 1; i < arrVar.length; i++) {
                    output += conn + arrVar[i] + e + backref
                }
            }
            return output;
        }
    }



    function createConnective(arrVar, connective) {
        // console.log(arrVar)
        if (arrVar.length == 1) return arrVar[0]
        out = arrVar[0]
        for (var i = 1; i < arrVar.length; i++) {
            out += connective + arrVar[i]
        }
        return out;
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
                return identity = "(" + parts.v_1[0] + eq + parts.backref + ')'
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
                    return "(" + parts.property_1[0] + and + parts.property_1[1] + ")";
                    break;
                case 3:
                    return "(" + parts.property_1[0] + and + parts.property_1[1] + and + parts.property_1[2] + ")";
            }
        }
    }

    var string_relations = {
        atMost: function(parts, s) {

        },
        atLeast: function(parts, s) {
            return parts.relations[0]
        }
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
            if (s.prefix == "atMost") {
                relations.push(predicates[s.relation] + v[i] + subject)
            }

        }

        if (s.prefix == "atLeast") relations.push(predicates[s.relation] + backref + subject)
        quantifier_backref = every + backref
        quantifier_relations = quantifiers[s.quantifier_2] + subject
        property_2 = predicates[s.kind_2] + subject



        output = {
            quantifier_backref: quantifier_backref,
            quantifiers_ID: quantifiers_ID,
            quantifier_relations: quantifier_relations,
            property_1: property_1,
            property_2: property_2,
            relations: relations,
            v_1: v,
            subject: subject,
            backref: backref

        }
        return output;
    }


})

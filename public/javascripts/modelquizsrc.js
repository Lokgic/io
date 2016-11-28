$(function() {
    var difficulty = 1;
    var Chance = require('chance')
    var _ = require('underscore')
    var makeAlert = require('./mods/alert.js')
    var mathjax = require('./mods/mathjax.js')
    var chance = new Chance();
    var constants = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't'];
    var variables = ['x','y']
    var predicates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    var forall = '\\forall';
    var exists = '\\exists'
    var negation = '\\neg'
    var conditional = '\\to'
    var conjunction = '\\wedge'
    var disjunction = '\\vee'
    var quantifiersOptions = [exists, forall]
    var connectives = [conditional,conjunction,disjunction]
    var buttNextState = "checkAnswer";


    var Proposition = function(model, option){
      var o = [variables, model.ud]
      left = model.predicates[chance.pickone(Object.keys(model.predicates))];
      right = model.predicates[chance.pickone(Object.keys(model.predicates))];
      this.left = {
        letter: left.letter,
        place: left.place,
        negated: chance.bool({likelihood: 10})
      }
      this.right = {
        letter: right.letter,
        place: right.place,
        negated: chance.bool({likelihood: 10})
      }
      if (this.left.negated) this.left.prefix = negation
        else this.left.prefix = ""
      if (this.right.negated ) this.right.prefix = negation
        else this.right.prefix = ""
      this.negated = chance.bool({likelihood: 10})
      if (this.negated) this.prefix = negation
        else this.prefix = ""
      this.totalPlace = this.left.place + this.right.place;

      this.left.vars = ""
      this.right.vars = ""
      var quantifiersStr = "";


          for (var i = 0;i < this.left.place;i++){

            this.left.vars += chance.pickone(o[chance.integer({min:0, max: o.length - 1})])

        }
        for (var i = 0;i < this.right.place;i++){
            this.right.vars += chance.pickone(o[chance.integer({min:0, max: o.length - 1})])

        }

        var allVars = _.uniq((this.left.vars + this.right.vars).split('')) // combine left and right's variable-string, turn it into an array, then use _ to get rid of dups.
        allVars = _.shuffle(_.filter(allVars, function(x){
          return _.contains(variables, x)
        }))

        this.allVars = allVars;
        this.quantifiers = {}
        console.log(quantifiersOptions)
        for (v in allVars){

          this.quantifiers[allVars[v]] = {
            variable: allVars[v],
            quantifier: chance.pickone(quantifiersOptions)
          }

          this.prefix += this.quantifiers[allVars[v]].quantifier + " "+ allVars[v]
        }


        this.connective = chance.pickone(connectives)
        var leftStr = this.left.prefix+" " + this.left.letter + this.left.vars;
        var rightStr = this.right.prefix +" "+  this.right.letter + this.right.vars;
        this.string = this.prefix  + " ( "+leftStr + " "+ this.connective +" "+ rightStr+ " ) "






      }


    function getVal(model,predicateLetter, tuple){
      return  _.contains(model.predicates[predicateLetter].extension, tuple)
    }

    Proposition.prototype.connectiveInterpret = function(model, l,r){

      v = []
      v[0] = getVal(model, self.left.letter, l)
      v[1] = getVal(model, self.right.letter, r)

      if (self.left.negated) v[0] = !v[0]
      if (self.right.negated) v[1] = !v[1]
      switch (self.connective){
        case conjunction: return (v[0] && v[1]);
        case conditional: return (!v[0] || v[1]);
        case disjunction: return v[0] || v[1];

      }


    }

    Proposition.prototype.evaluate = function(model){

        var self = this;


        quantifiers = this.quantifiers;
        left = this.left;
        right = this.right;
        connective = self.connective
        allVars = self.allVars;
        sub_L = [self.left.vars];
        sub_R = [self.right.vars];
        connectiveInterpret = self.connectiveInterpret;

        if (check.onlyConstant(sub_L[0]) && check.onlyConstant(sub_R[0])){
          out = connectiveInterpret(model, sub_L[0],sub_R[0])
          if (self.negated) return !out;
            else return out;
        }




          i = 0;
          if (quantifiers[allVars[i]].quantifier == forall) quantifier = "every"
            else quantifier = "some"

          out = _[quantifier](model.ud, function(x){
          targetVar = allVars[i]

          sub_L[i+1] = substite(sub_L[i], targetVar,x)
          sub_R[i+1] = substite(sub_R[i], targetVar,x)
          if (check.onlyConstant(sub_L[i+1]) && check.onlyConstant(sub_R[i+1])){


            return connectiveInterpret(model, sub_L[i+1],sub_R[i+1])
          }

          i += 1;
          if (quantifiers[allVars[i]].quantifier == forall) quantifier = "every"
            else quantifier = "some"

          out2 = _[quantifier](model.ud, function(y){
            targetVar = allVars[i];
            sub_L[i+1] = substite(sub_L[i], targetVar,y)
            sub_R[i+1] = substite(sub_R[i], targetVar,y)
            if (check.onlyConstant(sub_L[i+1]) && check.onlyConstant(sub_R[i+1])){
              return connectiveInterpret(model, sub_L[i+1],sub_R[i+1])
            }

            i += 1;
            if (quantifiers[allVars[i]].quantifier == forall) quantifier = "every"
              else quantifier = "some"
            out3 = _[quantifier](model.ud, function(z){
              targetVar = allVars[i];
              sub_L[i+1] = substite(sub_L[i], targetVar,z)
              sub_R[i+1] = substite(sub_R[i], targetVar,z)
              if (check.onlyConstant(sub_L[i+1]) && check.onlyConstant(sub_R[i+1])){
                return connectiveInterpret(model, sub_L[i+1],sub_R[i+1])
              }

                  })
                  return out3;
              })
              return out2;
        }.bind(this))


        if (self.negated) return !out;
          else return out;
    }




    function substite(originalString, targetVar, newConstant){
      newString = ""

      _.each(originalString.split(''), function(originalVar){
        if (originalVar == targetVar) newString += newConstant;
        else newString += originalVar;

      })

      return newString;
    }





    function evaluateConstants(set, vars, negated){

      if (negated) {
        return !(_.contains(set, vars));
      } else return (_.contains(set, vars))

    }

    var check = {
      isConstant: function(x){
        return _.contains(constants, x);
      },
      isVariable: function(x){
        return _.contains(variables, x);
      },
      hasConstant: function(x){
        for (y in x.split('')){
          if (this.isConstant(y)) return true;
        }
        return false;
      },
      hasVariable: function(x){
        for (y in x.split('')){
          if (this.isVariables(y)) return true;
        }
        return false;
      },
      onlyConstant: function(x){
        return _.every(x.split(''), function(y){
          return _.contains(constants, y);
        });
      },
      onlyVariable: function(x){
        return _.every(x.split(''), function(y){
          return _.contains(variables, y);
        });
      }
    }




    function initTable(diff) {

        var ysize = $('.tbutt').last().attr("id").split("-")[0];
        var size = $('.tbutt').last().attr("id").split("-")[1];
        var all = [];
        if (diff == 1) w = [.95, 0.05, 0]
        if (diff == 2) w = [0, 2,0]
        if (diff == 3) w = [0.05, 0.7, 0]
        pLetter = randomPickset(predicates, chance.integer({
            min: 1,
            max: 4
        }));

        predicates_pickedForModel = {};
        for (p in pLetter) {
          temp = {
            letter: pLetter[p],
            place: chance.weighted([1, 2, 3], w),
            vars:[]
          }
          predicates_pickedForModel[pLetter[p]] = temp;
        }


        if (diff == 1) {
            udmax = 10;
            udmin = 3
        } else if (diff == 2) {
            udmin = 2;
            udmax = chance.weighted([3, 4, 5], [.7, .15, .15])
        }
        ud = randomPickset(constants, udmax, udmin).sort();


        for (var i = 0; i <= size; i++) {
            all.push(makeModel(ud, predicates_pickedForModel, diff))
        }

        for (var i = 0; i <= size; i++) {
            $('#ud' + i).text('UD: {' + all[i].ud + '}')
            html = "";
            for (p in all[i].predicates) {
                html += all[i].predicates[p].string
            }

            $('#ext' + i).html(html)
        }

        props = []

        for (var i = 0; i<=ysize;i++){
          var temp = new Proposition(all[0],{name: true});
          props.push(temp);
          $('#statement'+i).text("\\(" + temp.string +"\\)");

        }
        console.log(props)

        mathjax.reload("table");
        var toReturn = []
        for (col in props){
          var tempRowArr = []
          for (row in all){
            tempRowArr.push(props[col].evaluate(all[row])+"")
          }
          toReturn.push(tempRowArr)
        }
        return toReturn;


    }





    function randomPickset(arr, max, min) {

        if (max > arr.length) {
            max = arr.length;
        }
        if (min > max) {
            max = min
        }
        if (typeof max == 'undefined' && typeof min == 'undefined') {
            max = arr.length;
            min = 0;
        } else if (typeof min == 'undefined' && typeof max != 'undefined') {
            min = max
        }

        return chance.pickset(arr, chance.integer({
            min: min,
            max: max
        }))
    }


    function makeModel(ud, predicates, diff) {

        var model = {}
        model.predicates = {};
        model.ud = ud;

        for (p in predicates) {
            model.predicates[predicates[p].letter] = initPredicate(predicates[p].letter, model.ud, diff, predicates[p].place);
        }
        return model;
    }



    function initPredicate(p, ud, diff, place) {

        out = {
            "letter": p,
            "place": place
        }
        ex = [];
        string = "";
        if (out.place == 1) {
            ex = randomPickset(ud, chance.weighted([0, ud.length], [5, 95]), 0).sort()
            string = '<p>' + p + ' : { ' + ex.join(' , ') + ' }</p>'

        } else {
            if (out.place == 2) w = [0.2, 0.25, 0.25, 0.2]
            else w = [0.01, 0.19, 0.5, 0.3]
            option = chance.weighted(["all", "self", "mixed", "none"], w);

            if (option == "none") {


            } else if (option == "self") {
                n = chance.integer({
                    min: 1,
                    max: ud.length
                });
                for (x in ud) {
                    temp = ""
                    for (var i = 0; i < out.place; i++) {
                        temp += ud[x];
                    }
                    ex.push(temp)
                }

            } else if (option == "all") {
                for (x in ud) {
                    for (y in ud) {
                        temp = ud[x] + ud[y]

                        if (out.place == 3) {

                            for (z in ud) {
                                newtemp = temp + ud[z]

                                ex.push(newtemp)
                            }
                        } else ex.push(temp)

                    }
                }
            } else {

                n = chance.integer({
                    min: 1,
                    max: chance.integer({
                        min: 2,
                        max: 10
                    })
                });
                if (n > (ud.length * ud.length)) n = ud.length * ud.length
                for (var i = 0; i < n; i++) {
                    var pair = "";

                    for (var j = 0; j < out.place; j++) {
                        pair += chance.pickone(ud)
                    }


                    while (ex.indexOf(pair) != -1) {
                        pair = ""
                        for (var j = 0; j < out.place; j++) {
                            pair += chance.pickone(ud)
                        }

                    }

                    ex.push(pair);


                }
                ex = ex.sort()


            }

            if (option == 'none') {
                string += "<p>" + p + ": { } " + "</p>"
            } else {
                tempString = ex[0].split('').join(' , ')
                var string = "<p>" + p + " : { ( " + tempString + " ) ";

                for (var i = 1; i < ex.length; i++) {
                    tempString = ex[i].split('').join(' , ')
                    string += ", ( " + tempString + " ) ";
                }
                string += ' }</p>'
            }


        }
        out.string = string;
        out.extension = ex;
        return out;
    }




    function getTableValues(ans) {
        var last = $('.tbutt').last().attr("id").split("-");
        var truthValues = [];
        for (var i = 0; i <= last[0]; i++) {
            var temp = []
            for (var j = 0; j <= last[1]; j++) {
                temp[j] = $("#" + i + "-" + j).attr("value")
            }
            truthValues[i] = temp;
        }
        // console.log("check")
        // console.log(truthValues)
        // console.log("against")
        // console.log(ans)

        if (_.isEqual(truthValues,ans)){
            makeAlert($('.jumbotron'), "b", "This is correct! Input: " + truthValues + " answer: " + ans+ ". Click submit again for next problem.",2)
        } else{
          makeAlert($('.jumbotron'), "b", "This is incorrect! Input: " + truthValues + " answer: " + ans + ". Click submit again for next problem.",4)
        }



    }


    function resetTable(){
      var last = $('.tbutt').last().attr("id").split("-");

      for (var i = 0; i <= last[0]; i++) {
          for (var j = 0; j <= last[1]; j++) {
              $temp = $("#" + i + "-" + j)
              $temp.removeClass("true");
              $temp.removeClass("false");
              $temp.text("?")
          }
      }

    }
    $('.tbutt').on('click', function() {
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
    })

    var currentAnswers = initTable(difficulty);
    console.log(currentAnswers)
    $('button').on('click', function(){

        switch (buttNextState){
        case "checkAnswer":{
          getTableValues(currentAnswers);
          buttNextState = "newTable"
          break;
        }
        case "newTable":{
          resetTable()
          currentAnswers = initTable(difficulty);
              console.log(currentAnswers)
          buttNextState ="checkAnswer"
          break;
        }
      }



    });
})

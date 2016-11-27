$(function() {
    var Chance = require('chance')
    var _ = require('underscore')
    var mathjax = require('./mods/mathjax.js')
    var chance = new Chance();
    var constants = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't'];
    var variables = ['x', 'y', 'z', 'w', 'u']
    var predicates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
    var quantifiers = ['\\forall', '\\exists']
    var connectives = ['\\to']

    var Proposition = function(model, option){
      left = model.predicates[chance.pickone(Object.keys(predicates))];
      right = model.predicates[chance.pickone(Object.keys(predicates))];
      this.left = {
        letter: left.letter,
        place: left.place,
        negated: chance.bool()
      }
      this.right = {
        letter: right.letter,
        place: right.place,
        negated: chance.bool()
      }
      if (this.left.negated) this.left.prefix = "\\neg"
        else this.left.prefix = ""
      if (this.right.negated ) this.right.prefix = "\\neg"
        else this.right.prefix = ""
      this.negated = chance.bool()
      if (this.negated) this.prefix = "\\neg"
        else this.prefix = ""
      this.totalPlace = this.left.place + this.right.place;
      // console.log(0< this.totalPlace)
      this.left.vars = ""
      this.right.vars = ""
      var quantifiersStr = "";
      switch (option){
        case option.name: {

          for (var i = 0;i < this.left.place;i++){

              this.left.vars += chance.pickone(model.ud)

          }
          for (var i = 0;i < this.right.place;i++){
              this.right.vars += chance.pickone(model.ud)

          }
        }

        default: {
          this.connective = chance.pickone(connectives)
          var leftStr = this.left.prefix+" " + this.left.letter + this.left.vars;
          var rightStr = this.right.prefix +" "+  this.right.letter + this.right.vars;
          this.string = this.prefix +" "+ quantifiersStr + " ( "+leftStr + " "+ this.connective +" "+ rightStr+ " ) "

        }
        console.log(option.name)
        console.log(this)

      }
      //
      // for (var i = 0;i < this.left.place;i++){
      //
      //     this.left.vars += chance.pickone(variables)
      //
      // }
      // for (var i = 0;i < this.right.place;i++){
      //     this.right.vars += chance.pickone(variables)
      //
      // }
      //
      // allVars = _.union(this.left.vars.split(''), this.right.vars.split(''))
      //
      // this.quantifiers = {}
      // for (v in allVars){
      //   this.quantifiers[allVars[v]] = {
      //     variable: allVars[v],
      //     quantifier: chance.pickone(quantifiers)
      //   }
      // }



      // for (v in this.quantifiers){
      //   quantifiersStr += this.quantifiers[v].quantifier+" " + this.quantifiers[v].variable + " ";
      // }



    }

    Proposition.prototype.evaluate = function(model){


    }


    initTable(2)

    function initTable(diff) {

        var ysize = $('.tbutt').last().attr("id").split("-")[0];
        var size = $('.tbutt').last().attr("id").split("-")[1];
        var all = [];
        if (diff == 1) w = [.95, 0.05, 0]
        if (diff == 2) w = [0.45, 0.5, 0.05]
        if (diff == 3) w = [0.05, 0.7, 0]
        // pPlace = []
        pLetter = randomPickset(predicates, chance.integer({
            min: 2,
            max: 5
        }));
        predicates = {};
        for (p in pLetter) {
          temp = {
            letter: pLetter[p],
            place: chance.weighted([1, 2, 3], w),
            vars:[]
          }
          predicates[pLetter[p]] = temp;
        }


        if (diff == 1) {
            udmax = 10;
            udmin = 3
        } else if (diff == 2) {
            udmin = 3;
            udmax = chance.weighted([4, 5, 6], [.7, .15, .15])
        }
        ud = randomPickset(constants, udmax, udmin).sort();


        for (var i = 0; i <= size; i++) {
            all.push(makeModel(ud, predicates, diff))
        }

        for (var i = 0; i <= size; i++) {
            $('#ud' + i).text('{' + all[i].ud + '}')
            html = "";
            for (p in all[i].predicates) {
                html += all[i].predicates[p].string
            }
            // console.log(html)
            $('#ext' + i).html(html)
        }
        props = []

        for (var i = 0; i<=ysize;i++){
          var temp = new Proposition(all[0],{name: true});
          props.push(temp);
          $('#statement'+i).text("\\(" + temp.string +"\\)")
          // console.log(temp)
        }
        // console.log(props)
        mathjax.reload("table");


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
    // test = randomPickset(predicates,1,500)
    // console.log(test)

    function makeModel(ud, predicates, diff) {
        // var max
        // var min
        // if (diff == 1) {
        //     max = 10;
        //     min = 3
        // } else if (diff == 2) {
        //     min = 3;
        //     max = chance.weighted([4, 5, 6], [.7, .15, .15])
        // }
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
                // console.log(ex)
            } else if (option == "all") {
                for (x in ud) {
                    for (y in ud) {
                        temp = ud[x] + ud[y]

                        if (out.place == 3) {

                            for (z in ud) {
                                newtemp = temp + ud[z]
                                    // console.log(newtemp)
                                ex.push(newtemp)
                            }
                        } else ex.push(temp)
                            // console.log(ex)
                    }
                }
            } else {
                // console.log(ud)
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
                        // console.log(pair);
                        // console.log(ex.indexOf(pair) != -1)
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




    function getTableValues() {
        var last = $('.tbutt').last().attr("id").split("-");
        var truthValues = [];
        for (var i = 0; i <= last[0]; i++) {
            var temp = []
            for (var j = 0; j <= last[1]; j++) {
                temp[j] = $("#" + i + "-" + j).text()
            }
            truthValues[i] = temp;
        }

        console.log(truthValues)
    }

    $('.tbutt').on('click', function() {
        if ($(this).text() == "T") $(this).text("F")
        else $(this).text("T")
    })

    $('button').on('click', getTableValues);
})

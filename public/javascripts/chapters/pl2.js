$(function(){


  function phyllotaxis(radius) {
          var theta = Math.PI * (3 - Math.sqrt(5));
          return function(i) {
              var r = radius * Math.sqrt(i),
                  a = theta * i;
              return [
                  width / 2 + r * Math.cos(a),
                  height / 2 + r * Math.sin(a)
              ];
          };
      }


  var margin = {
              top: 10,
              right: 10,
              bottom: 10,
              left: 10
          }
  textInputInit();

  var container = d3.select('#intuitivemodel').attr('class','row p-a-0 m-y-3')
  left = container.append('div').attr('class','col-md-4').attr('id','intuitivemodelLeft').style('border','0px')
  right = container.append('div').attr('class','col-md-8').attr('id','intuitivemodelRight').style('border','0px')
  width = $('#intuitivemodelRight').width() - margin.left - margin.right,
  height = window.innerHeight*.7 - margin.top - margin.bottom;
  var points = d3.range(26).map(phyllotaxis(55));
  var svg = d3.select('#intuitivemodelRight').append('svg').attr('width', width).attr('height', height)
  g = svg.append('g')


  var state = []
  var circle = g.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("transform", function(d) { return "translate(" + d[0] + "," + d[1] + ")"; })
        .attr("r", 20)
        .style('opacity', 1)
        .attr('class','modelBlack')
        .attr('data', function(d,i){
          state[i] = 'black'
          return i;
        })

      var text = g.selectAll("text")
            .data(points)
            .enter().append("text")
            .attr("transform", function(d) { return "translate(" + d[0] + "," + (d[1]+5) + ")"; })
            .style('opacity', 1)
            .style('text-anchor','middle')
            .style('fill','white')
            .text(function(d,i){
              return String.fromCharCode(97 + i)
            })
      // console.log(circle.enter())
      circle.on('click',function(){
          console.log(this)
          var cycle = {
            "modelBlack":"modelRed",
            "modelRed":"modelBlue",
            "modelBlue":"modelBlack"
          }
          d3.select(this).attr('class',cycle[d3.select(this).attr('class')])
          var dataCycle = {
            "black":"red",
            "red":"blue",
            "blue":"black"
          }
          state[d3.select(this).attr('data')] = dataCycle[state[d3.select(this).attr('data')]]
          // console.log(state)
          var input = []
          pl.text(function(d,i){
            input.push(stateCheck[i]())
            return d + ": " + stateCheck[i]()
          })
          console.log(input)
          var match = []
          for (k in input){
            if (input[k] != answer[k]) match[k] = false
            else match[k] = true
          }
          if (_.every(match, function(v){ return v ==true;})) {
            alert('You have completed this exercise','correctblue')
            recordCompletion(uid, 'pl', 2, 1)
          }
        })


        var answer = [
          false,false,false,true,false,false,true,true
        ]
        var statements =[
          'Every circle is black',
          'Some circles are red',
          'Some circles are not blue',
          "Circle A is blue",
          "Circle H is neither blue nor red",
          "All vowels are red",
          "Some consonant letters are blue",
          "No letter prior to E is black"
        ]
        var vowels = [0,4,11,8,20]
        var stateCheck = [
          function(){return !_.contains(state,"red") && !_.contains(state,"blue")} ,
          function(){return  _.contains(state, 'red')},
          function(){return  _.some(state, function(c){
            return c != 'blue'
          })},
          function(){return  state[0] == 'blue'},
          function(){return  state[7] == 'black'},
          function(){return  state[0] == 'red' && state[4] == 'red' && state[8] == 'red' && state[14] == 'red' && state[20] == 'red'},
          function(){
            for (x in state){
              if (!_.contains(vowels,state[x]) && state[x] == 'blue') return true
            }
            return false
          },
          function(){
            for (var i = 0; i < 4; i++){
              if (state[i] == 'black')return false
            }
            return true
          }


        ]


        var pl = left.selectAll('p')
              .data(statements)
             .enter()
             .append('p')
             .text(function(d,i){
               return d + ": " + stateCheck[i]()
             })

             makeCategory({eventId : "pl-2-cat",shuffle:false})

})

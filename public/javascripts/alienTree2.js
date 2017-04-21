$(function() {
  var symbolkey = {
    "A":"x is an ancestor of y.",
    "P":"x is parent of y.",
    "C":"x is child of y.",
    "L":"x is of the same lineage as y.",
    "R":"x is same race as y.",
    "S":"x is a sibling of y.",
    "F":"x is from the same family as y.",
    "G":"x is a grandparent of y.",
    "W":"x is between y and z",
    "B":"x is blue.",
    "D":"x is red.",
    "U":"x is purple."
    }
    var parm = {
      toPass: 30,
      logiciseCategory:"alienTree",
      logiciseId: "alienTree2",
      module: "pl",
      chanceLeft:2,
      noAtt: true
    }

    var tracker = new logiciseTracker(parm)
    tracker.analytic = new modelStatDataObject(uid);
    tracker.analyticId = "alienTree"
    tracker.updateStatus()


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // console.log(symbolkey)
    var floatInfo = ""
    for (key in symbolkey){
      floatInfo += "<p>"+key +" : " + symbolkey[key] + "</p>"
      // console.log(floatInfo)

    }
    tracker.floatInfo(floatInfo)
    tracker.drawProblem = function(){

        tracker.state = "userInput"
        var me = this
        tracker.cleanDisplay()
        tracker.loadProblem("exp",function(data){

          tracker.analytic.processModel(data)

          me.problemSet = data.problems
          var problem = me.problemSet.pop()

          me.currentProblem = problem[0]
          mainDisplay.text("Evalute this statement: $"+me.currentProblem.string+"$")
          me.currentAnswer = problem[1]
          mathJax.reload()
          var dimensions = {}
           dimensions.width = $('#display').width();
           dimensions.height = window.innerHeight*.7;
          //  console.log(dimensions)

          // set the dimensions and margins of the diagram
          var margin = {top: 50, right:30, bottom: 100, left: 30},
              width = dimensions.width - margin.left - margin.right,
              height = dimensions.height - margin.top - margin.bottom;
          var root = d3.stratify()
              .id(function(d) {
                  return d.name;
              })
              .parentId(function(d) {
                  return d.parent;
              })
              (data.relation);


          var treemap = d3.tree()
              .size([width,height]);


          // maps the node data to the tree layout
          nodes = treemap(root);
          // console.log(nodes)
          var svg = d3.select("#display").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom),
              g = svg.append("g")
              .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

          var link = g.selectAll(".link")
              .data(nodes.descendants().slice(1))
              .enter().append("path")
              .attr("class", "link")
              .attr("d", function(d) {
                return "M" + d.x + "," + d.y
             + "L" + d.parent.x + "," + d.parent.y;
              });

          // adds each node as a group
          var node = g.selectAll(".node")
              .data(nodes.descendants())
              .enter().append("g")
              .attr("class", function(d) {
                  return "node" +
                      (d.children ? " node--internal" : " node--leaf");
              })
              .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
              });

              d3.xml("../img/alien.svg", function(xml) {

        // Take xml as nodes.
              var imported_node = document.importNode(xml.documentElement, true);
             node.each(function(d){

               var imported_svg = this.appendChild(imported_node.cloneNode(true));
               d3.select(imported_svg)
               .style('fill',   d.data.color   )
               .attr('width','30')
               .attr('height','40')
               .attr("x", "-15")
               .attr("y", "-25")
               .on("mouseover", function() {
                 div.transition()
                     .duration(200)
                     .style("opacity", .9);

                var html = "<p class = 'lead m-x-1'> " + d.data.name + "</p>" + "<p class = 'm-x-1'> Race: " + d.data.color + "</p>" + "<p class = ' m-x-1'> PL constant: " + d.data.constant + "</p>"

                 div.html(
                   html
                 )
                     .style("left", (d3.event.pageX)+20 + "px")
                     .style("top", (d3.event.pageY) +20 + "px")
                     .style('background', 'rgba(55,55,55,1)')
                     .style("color", function() {
                       return 'white'
                     })
                 })
             .on("mouseout", function(d) {
                 div.transition()
                     .duration(500)
                     .style("opacity", 0);
             });
             })

            });

          // adds the text to the node
          node.append("text")
              .attr("dy", ".35em")
              .attr("x", 25)
              .style("text-anchor", "start")
              .text(function(d) {
                  return d.data.constant +": "+d.data.name;
              });
        })
    }
    tracker.nextProblem = function(){
      var me = this
      me.currentChoice = null
      me.state = "userInput"
      if (this.problemSet.length!=0 && this.problemSet != null){
        var problem = me.problemSet.pop()
        me.currentProblem = problem[0]
        mainDisplay.text("Evalute this statement: $"+me.currentProblem.string+"$")
        me.currentAnswer = problem[1]
        console.log(problem)

        mathJax.reload()
      } else{
        console.log(tracker.analytic);
        tracker.analytic.sendDB("alienTree")
        tracker.drawProblem()
      }
    }

    // var nextState = {
    //   "intro":"newTree",
    //   "userInput":"checkAnswer",
    //   "nextProblem":"nextProblem"
    // }


    tracker.butt[3].default = "Show Symbolization Keys"

    tracker.butt[2].default = "Choose Truth Value"


    tracker.enableButt(2,tracker.butt[2].default)
    tracker.enableButt(3,tracker.butt[3].default)
    tracker.butt[3].d3obj.on('click',function(){
      tracker.floatInfoToggle()
      if (tracker.butt[3].d3obj.text() == tracker.butt[3].default) tracker.butt[3].d3obj.text("Hide Keys")
      else tracker.butt[3].d3obj.text(tracker.butt[3].default)
    })


    tracker.butt.confirm.d3obj.on('click',function(d){
      if (tracker.state == "nextProblem"){
        tracker.butt[2].d3obj.text(tracker.butt[2].default)
                              .attr("style","")
      }
      tracker.nextState()
    })

    tracker.butt[2].d3obj.on('click',function(){
      if (tracker.state == "userInput"){
        if (tracker.currentChoice == true) {
          tracker.currentChoice = false;
          tracker.butt[2].d3obj.style('background', 'salmon')
        }
        else {
          tracker.currentChoice = true;
          tracker.butt[2].d3obj.style('background', 'skyblue')
        }
        d3.select(this).text("Your answer: " +tracker.currentChoice)
      }
    })
    tracker.enableTutorial()


    var mainDisplay = d3.select('.subNav').append('p').attr('class','lead m-y-0')



})

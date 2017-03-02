$(function() {
  var symbolkey = {
    "A":"x is ancestor of y.",
    "P":"x is parent of y.",
    "C":"x is child of y.",
    "L":"x is of the same lineage as y.",
    "R":"x is same race as y.",
    "S":"x is sibling of y.",
    "B":"x is blue.",
    "D":"x is red.",
    "K":"x is black.",
    "G":"x is green.",
    "U":"x is purple.",
    "F":"x is from the same family as y."
  }
    var parm = {
      toPass: 30,
      logiciseCategory:"alienTree",
      logiciseId: "alienTree1",
      module: "pl",
      chanceLeft:2
    }
    var tracker = new logiciseTracker(parm)
    tracker.updateStatus()
    tracker.enableButt(2,"Choose Truth Value")
    tracker.enableButt(3,"Symbolization Keys")
    // console.log(symbolkey)
    var floatInfo = ""
    for (key in symbolkey){
      floatInfo += "<p>"+key +" : " + symbolkey[key] + "</p>"
      // console.log(floatInfo)

    }
    tracker.floatInfo(floatInfo)

    var nextState = {
      "intro":"newTree",
      "userInput":"checkAnswer"
    }

    tracker.butt[3].on('click',function(){
      tracker.floatInfoToggle()
    })

    tracker.butt[2].on('click',function(){
      if (tracker.currentChoice == true) tracker.currentChoice = false;
      else tracker.currentChoice = true;
      d3.select(this).text("Your answer: " +tracker.currentChoice)

    })
    tracker.state = "intro"

    tracker.butt.confirm.on('click',function(d){
      tracker[nextState[tracker.state]]()
    })

    tracker.checkAnswer = function(){
      var me = this
      if (this.currentChoice == null) alert("No input detected!","important")
      else{
        if (this.currentChoice == this.currentAnswer){
          alert("Correct!","correctblue")
          tracker.addScore()
          tracker.updateStatus()
        }
      }
    }
    var mainDisplay = d3.select('.subNav').append('p').attr('class','lead m-y-0')
    tracker.newTree = function(){

        tracker.state = "userInput"
        var me = this
        tracker.cleanDisplay()
        tracker.loadProblem("exp",function(data){

          me.problemSet = data.problems
          var problem = me.problemSet.pop()
          console.log(problem)
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
          console.log(nodes)
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
    // loadTree(function(data){
    //
    //
    // })



})

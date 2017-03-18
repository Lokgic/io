$(function(){

  var tooltipData
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
  tooltip.style("right",  "10px")
        .style('position','fixed')
        .style("top", "90%")
        .text("Mouse over each tree node for further information.")
  tooltip.transition()
      .duration(500)
      .style("opacity", 0.5)
  function drawTree(treeData,div,type){
    // console.log(treeData)
    // set the dimensions and margins of the diagram
    var svg = d3.select(div).append("svg")
    var scope = d3.select(div)
    var dimensions ={}
    function setDimensions(){
      // var winDi = d3.select(div).node().getBoundingClientRect();
      // console.log(winDi)
      dimensions.width = d3.select(div).node().getBoundingClientRect().width
      if (window.innerWidth < window.innerHeight){
        dimensions.height = dimensions.width*1.5
        // d3.select('.carousel-inner').style('height','150vh')
      }else{

        dimensions.height = d3.select('.explocontainer').node().getBoundingClientRect().height


      }
      console.log(dimensions)
      svg.attr("width", dimensions.width)
      .attr("height", dimensions.height)
      // console.log(dimensions)
    }
    // console.log(d3.select(div).node().getBoundingClientRect())


    setDimensions();
    // var originalPos = dimensions.top/3


    var margin = {top: 60, right: 30, bottom: 60, left: 30},
        width = dimensions.width - margin.left - margin.right,
        height = dimensions.height - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);


        g = svg.append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


    var link = g.selectAll(".link")
        .data( nodes.descendants().slice(1))
      .enter().append("path")
        .attr('class', function(d,i){
          return 'link link'+i
        })
        .attr("d", function(d) {
          // console.log(d)
           return "M" + d.x + "," + d.y
             + "C" + d.x + "," + (d.y + d.parent.y) / 2
             + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
             + " " + d.parent.x + "," + d.parent.y;
           });
    //
    // // adds each node as a group
    var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function(d,i) {

          return   "node" +
            (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; });


    //       // adds the circle to the node
        node.append("circle")
            .attr('class',function(d,i){
              return 'mover circle'+i
            })
            .attr("r", function(d){
              if (_.contains(d.data.name.split(""),"|")){
                var num = d.data.name.split("|").length
                return 20*num
              }else{
                return 20
              }
            })
         .on('mouseover', function(d,i){
           if (type == "sl"){
             var allCells = d3.selectAll('td')._groups[0]
             for (var n = 0; n<allCells.length;n++){
               if (!_.contains(d.data.cell,parseInt(n))){
                 d3.select(allCells[n])
                 .transition()
                 .style('background','black')
                 d3.select(allCells[n])
                 .transition()
                 .style('opacity',0)
                 // console.log(allCells[n])
               }
            }
          }else if (type =="pl"){
            var area = d3.select('.leftBottom')
            area.html("")
            area.classed('text-xs-center',true)
            var text = ""
            for (set in d.data.model){
              area.append('p')
                  .text('$'+set+'$:$\\{' + d.data.model[set]+ '\\}$')
            }
            mathJax.reload('.leftBottom')
          }




             for (var x = 0;x<d3.selectAll('.node')._groups[0].length;x++){
              //  d3.select('.entity'+i+' .link').style('opacity',0)
               if (!_.contains(d.data.node,parseInt(x))){
                //  d3.select('.link'+i).style('opacity',0)
                //  d3.selectAll('.link'+x).style('opacity',0)
                 d3.selectAll('.text'+x).style('opacity',0)


               }

               if (!_.contains(d.data.link,parseInt(x))){
                //  d3.select('.link'+i).style('opacity',0)
                //  d3.selectAll('.link'+x).style('opacity',0)
                 d3.selectAll('.link'+x).transition().style('opacity',0)


               }


               tooltip.html('')
                     .append('p')
                     .text(tooltipData[i])
              if (window.innerWidth < window.innerHeight || window.innerWidth <600){
                tooltip.style("right",  "10px")
                    .style("top", "70%")
                    .style('position','fixed')
              }else{
                tooltip.style('position','absolute')
                .style("right", "30px")
                    .style("top", (d3.event.pageY) - 90 + "px")
              }


                  tooltip .style('background','white')
                   .style("color", 'black')
                tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            mathJax.reload('.tooltip')
              // console.log(_.contains(d.data.cell,6))

           }
          //  console.log(i)
         })
         .on("mouseout",function(){
           if (type == "sl"){
             d3.selectAll('td')
             .transition()
             .style('background','white')
             .style('opacity',1)
           }else if (type == "pl"){
               var area = d3.select('.leftBottom')
               area.html("")
               area.classed('text-xs-center',true)
               for (set in leftBottomDefault){
                 area.append('p')
                     .text('$'+set+'$:$\\{' + leftBottomDefault[set]+ '\\}$')
               }
               mathJax.reload('.leftBottom')
           }


           for (var x = 0;x<d3.selectAll('.node')._groups[0].length;x++){
             d3.selectAll('.link'+x)
             .transition()
                .style('opacity',1)
              d3.selectAll('.text'+x)
                 .style('opacity',1)

            }
            tooltip.style("right",  "10px")
                  .style("top", "90%")
                  .style('position','fixed')
                  .text("Mouse over each tree node for further information.")
            tooltip.transition()
                .duration(500)
                .style("opacity", 0.5);

         })
    //       // adds the text to the node
          node.each(function(d,i) {

              if (_.contains(d.data.name.split(''),'|')){
                // console.log(this)
                var t = d3.select(this).append('text')
                .style("text-anchor", "middle")
                .attr('class','text'+i)
                var textchunks = d.data.name.split('|')
                var length = -(5 * textchunks.length)
                var y = 0
                if (d.height == 0){
                  var temp =[];
                  for (var k = textchunks.length-1;k >=0;k--){
                    temp.push(textchunks[k])
                  }
                  textchunks = temp
                }
                for (chunck in textchunks){
                  var dy
                  if (parseInt(chunck)==0) dy = 0
                  else if (d.height == 0) {
                    dy = -20
                  }
                  else dy =  25;
                  t.append('tspan')
                    .attr('x',0)
                    .attr('dy', dy)
                    .text(textchunks[chunck])
                    .attr('class','text'+i)

                }

              }
              else {
                d3.select(this)
                .append("text")

                .attr('stroke-fill','grey')
                .attr('class','text'+i)
                .attr("y", function(d) { return 8; })
                .style("text-anchor", "middle")
                .text(d.data.name);
            }
            })


  }


  $.getJSON("explos.json", function(json) {
    // console.log(json.truthTrees); // this will show the info it in firebug console

    var title = d3.select('.exploTitle').attr('id')
    var type = json[title].type
    var section1  = json[title].sections[0]
    console.log(section1)
    var leftTop = d3.select('.leftTop')
    leftTop.selectAll('p')
            .data(section1.text)
            .enter()
            .append('p')
            .attr('class','text-justify')
            .text(function(d){
              console.log(d)
              return d})
    // explanation.append('h3').text(section1.title)
    if (type == "sl") tabulate(section1.data.anatomy,".leftBottom")
    else if (type == "pl"){
        leftBottomDefault = section1.default
        var area = d3.select('.leftBottom')
        area.classed('text-xs-center',true)
        for (set in section1.default){
          area.append('p')
              .text('$'+set+'$:$\\{' + section1.default[set]+ '\\}$')
        }
        mathJax.reload('.leftBottom')
    }
    drawTree(section1.data.anatTree,".interaction",type)
    tooltipData = section1.tooltip
    mathJax.reload()

  });


})

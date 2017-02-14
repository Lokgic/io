$(function(){


    var dimensions = {}
     dimensions.width = $('#display').width();
     dimensions.height = window.innerHeight*.7;
     console.log(dimensions)
    // set the dimensions and margins of the diagram
    var margin = {top: 30, right:30, bottom: 30, left: 30},
        width = dimensions.width - margin.left - margin.right,
        height = dimensions.height - margin.top - margin.bottom;



    var treeData = {
      "name":"A",
      "children":[
        {"name":"B\\vee C \\vee D \\vee Q",
        children:[
          {"name":"B",closed:true},
          {"name":"C",closed:false}
        ]}
      ]
    }


    var choices = [ 'A', 'B\\vee C \\vee D \\vee Q', 'B', 'C' ]

    $.post('/getTrees',function(d){
      console.log(d)
    })

    function makeChoices(choices, d3obj){
      d3obj.selectAll('button')
                    .data(choices)
                    .enter()
                    .append('button')
                    .text(function(d){return d})
    }





    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([width, height])


    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

// d3.select(d3.select(this).node().parentNode).classed('node--leaf')


    // maps the node data to the tree layout
    nodes = treemap(nodes);

      var svg = d3.select('#display')
                  .append('svg')
                  .attr('height',dimensions.height)
                  .attr('width',dimensions.width)

        g = svg.append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


    var link = g.selectAll(".link")
        .data( nodes.descendants().slice(1))
      .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
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
        .attr("class", function(d) {
          return " depth"+d.depth + " node" +
            (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; });
    var branchAnswer = {}
    var answersChosen = []
    node.append("circle")
      .attr("r", 20)
      .each(function(d,i){
        var slideMenu = d3.select('main').append('div').attr('class','treechoices').attr('id','answer'+i)

       slideMenu.selectAll('button')
                     .data(choices)
                     .enter()
                     .append('button')
                     .attr('data',d)
                     .text(function(d,i){
                       answersChosen[i] = false
                       return "$$"+d+"$$"})
                     .attr('class','treeChoiceButt btn-greyish btn-info m-a-1')
                     .on('click',function(bd,bi){
                       var txt = (d.data.closed != null && document.getElementById("checkbox"+i).checked)? "$$"+bd + "\\\\X$$":"$$"+bd + "$$";


                        console.log()
                       d3.select('#nodeText'+i).remove()
                       d3.select('#display').append('div')
                                            .attr('id','nodeText'+i)
                                            .attr('class','latexNode')
                                            .style('left',d.x - 220)
                                            .style('top',d.y)
                                            .text(txt)
                        mathJax.reload('.latexNode')


                        if (d.data.closed != null){
                          branchAnswer[i]= document.getElementById("checkbox"+i).checked == d.data.closed
                        }
                        if (bd == d.data.name) answersChosen[i] = true
                        console.log(answersChosen)

                        d3.select($('#answer' + i).height('0px'))
                        console.log(branchAnswer)


                     })
          console.log(d.data.data)
         if (d.data.closed != null){
           var checkBox =  slideMenu.append('label')
                      .attr('class','form-check-label m-y-1')

                      .style('display','block')
                      .style('color','black')
                      .style('font-size','1.2em')
                      .html('<input type="checkbox" id = "checkbox'+i+'"  class="form-check-input m-x-2 m-y-0">Close Branch?')

         }


      })
      .on('mouseover',function(d){
        console.log(d)
        d3.select(this).transition().style('fill','grey')


      })
      .on('mouseout',function(d){
        console.log(d)
        d3.select(this).transition().style('fill','white')


      })
      .on('click',function(d,i){
        console.log(d)


        $('#answer' + i).height('300px')

      })

      d3.select('#confirm').on('click')
      mathJax.reload('#display')






})

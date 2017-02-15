$(function(){


    var dimensions = {}
     dimensions.width = $('#display').width();
     dimensions.height = window.innerHeight*.7;
     console.log(dimensions)
    // set the dimensions and margins of the diagram
    var margin = {top: 30, right:30, bottom: 30, left: 30},
        width = dimensions.width - margin.left - margin.right,
        height = dimensions.height - margin.top - margin.bottom;


        function BFS(root){
          var explored = []
          var toSearch = []
          toSearch.push(root)
          while(toSearch.length > 0){
            var n = toSearch.shift()
            if (!_.contains(explored,n.name)) explored.push(n.name)
            if (n.children){
              for (child in n.children){
                toSearch.push(n.children[child])
              }
            }
          }
          return explored
        }
    // var treeData = {
    //   "name":"A",
    //   "children":[
    //     {"name":"B\\vee C \\vee D \\vee Q",
    //     children:[
    //       {"name":"B",closed:true},
    //       {"name":"C",closed:false}
    //     ]}
    //   ]
    // }


    var choices = [ 'A', 'B\\vee C \\vee D \\vee Q', 'B', 'C' ]

    $.post('/getTrees',function(d){
      console.log()
      drawTree(d.tree,BFS(d.tree))
    })

    // function makeChoices(choices, d3obj){
    //   d3obj.selectAll('button')
    //                 .data(choices)
    //                 .enter()
    //                 .append('button')
    //                 .text(function(d){return d})
    // }

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([width, height])


    function drawTree(treeData, choices){
      var nodes = d3.hierarchy(treeData);

      var branchAnswer = {}
      var answersChosen = []


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

      node.append("circle")
        .attr("r", 20)
        .attr('id',function(d,i){
          return "node_"+i
        })
        .each(function(d,i){
          if (d.data.premise){
            answersChosen[i] = true
            d3.select('#display').append('div')
                                  .attr('id','nodeText'+i)
                                  .attr('class','latexNode')
                                  .style('left',d.x - 220)
                                  .style('top',d.y +8)
                                  .text("$$P_"+(i+1)+": "+d.data.name+"$$")
              // mathJax.reload('.latexNode')
              return
          }else if (d.data.conclusion){
            answersChosen[i] = true
            d3.select('#display').append('div')
                                  .attr('id','nodeText'+i)
                                  .attr('class','latexNode')
                                  .style('left',d.x - 220)
                                  .style('top',d.y +8)
                                  .text("$$\\therefore " +d.data.name+"$$")
              // mathJax.reload('.latexNode')
              return
          }

          var slideMenu = d3.select('main').append('div').attr('class','treechoices').attr('id','answer'+i)
          answersChosen[i] = false
         slideMenu.selectAll('button')
                       .data(choices)
                       .enter()
                       .append('button')
                       .attr('data',d)
                       .text(function(d,i){

                         return "$$"+d+"$$"})
                       .attr('class','treeChoiceButt btn-greyish btn-info m-x-1 m-t-3')
                       .on('click',function(bd,bi){
                         var txt = (d.data.closed != null && document.getElementById("checkbox"+i).checked)? "$$"+bd + "\\\\X$$":"$$"+bd + "$$";


                          console.log()
                         d3.select('#nodeText'+i).remove()
                         d3.select('#display').append('div')
                                              .attr('id','nodeText'+i)
                                              .attr('class','latexNode')
                                              .style('left',d.x - 220)
                                              .style('top',d.y + 8)
                                              .text(txt)
                          mathJax.reload('.latexNode')




                          if (bd == d.data.name) answersChosen[i] = true
                          else answersChosen[i] = false

                          if (d.data.closed != null){
                            branchAnswer[i]= document.getElementById("checkbox"+i).checked == d.data.closed
                            answersChosen[i] = branchAnswer[i]
                          }


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
          var temp = "M " + d.x + " " + (d.y +45)+" m 30 0 h 100 m -80 0 h -100"
          var line = svg.append('path')
                        .attr('d',temp)
                        .attr('class','spaceholder')
                        .style('stroke-width','1')
                        .style('stroke','grey')

          // d3.select(this).transition().style('fill','grey')


        })
        .on('mouseout',function(d){
          d3.selectAll('.spaceholder').remove()
            // console.log(d)
          // d3.select(this).transition().style('fill','white')


        })
        .on('click',function(d,i){
          console.log(d)


          $('#answer' + i).height('300px')

        })


        mathJax.reload('#display')

        d3.select('#confirm').on('click',function(){

          node.selectAll('circle')
              .each(function(){
                  var i = d3.select(this).attr('id').split('_')[1]
                console.log(answersChosen[i])
                if (answersChosen[i]) d3.select(this).transition(1000).style('fill','#4FD5D6')
                else d3.select(this).transition().duration(1000).style('fill','#D889B8')
              })
        })
    }




    //  assigns the data to a hierarchy using parent-child relationships







})

$(function() {



    completeColor = "#444C5C"

    var color = {
      "module":"#2d4262",
      "task":"#0048B2",
      "subtask":'#B27700',
      "chapter":'#FFB219',
      "section":"#FFAC00"
    }
    var readinEx = 1;
    var logicize = 2;
    var ass = 6;
    var test = 7
    var pa = 3

    var sl = {
      "name":"Sentence Logic",
      "type":"module",
      "children":[
        {
          "name":"Web Assignments",
          "type":"task",
          "children":[
            {
                    "name": "Reading",
                    "type":"subtask",
                    'children': [{
                        "name": "Introduction: Validity and Venn Diagrams",
                        "type":"chapter",
                        "children": [{
                            "name": 'Evaluate Validity Intuitively',
                            "type": "section",
                            "completed": false
                        }, {
                            "name": 'Basic Venn Diagram',
                            "type": "section",
                            "completed": false
                        }, {
                            "name": "Concepts review",
                            "type": "section",
                            "completed": false
                        }]
                    }, {
                        "name": "The formal language of SL",
                        "type": "chapter",
                        "children": []
                    }, {
                        "name": "Core Concepts in Formal Logic",
                        "type": "chapter",
                        "children": []
                    },
                    {
                        "name": "Conditionals",
                        "type": "chapter",
                        "children": []
                    },
                    {
                        "name": "Truth Trees (Semantic Tableaux)",
                        "type": "chapter",
                        "children": []
                    }]
                }, {
                    "name": "logicize",
                    "type":"subtask",
                    "children": [{
                        "name": "Venn Diagram and Syllogistic Validity",
                        "type": "chapter"
                    }, {
                        "name": "Wason Selection Task",
                        "type": "chapter"
                    }, {
                        "name": "Puzzles",
                        "type": "chapter"
                    }, {
                        "name": "Using Truth Trees",
                        "type": "chapter"
                    }]
                }
          ]
        },
        {
          "name":"Problem Set 1",
          "type":"task"
        },
        {
          "name":"Test 1",
          "type":"task"
        }
      ]
    }
    var pl = {
      "name":"Predicate Logic",
      "type":"module",
      "children":[
        {
          "name":"Web Assignments",
          "type":"task",
          "children":[
            {
                    "name": "Reading",
                    "type":"subtask",
                    'children': [{
                        "name": "Syntax",
                        "type":"chapter",
                        "children": []
                    }, {
                        "name": "Translations",
                        "type":"chapter",
                        "children": []
                    }, {
                        "name": "Model Semantics",
                        "type":"chapter",
                        "children": []
                    },
                    {
                        "name": "Trees for PL",
                        "type":"chapter",
                        "children": []
                    }]
                }, {
                    "name": "logicize",
                    "type":"subtask",
                    "children": [{
                        "name": "Wason with Quantities (English)",
                        "type":"chapter"

                    }, {
                        "name": "Wason Selection Task in PL",
                        "type":"chapter"
                    }, {
                        "name": "Puzzles with Quantities",
                        "type":"chapter"
                    },
                    {"name":"Model Interpretation",
                    "type":"chapter"
},
                     {
                        "name": "Grid Game 1",
                        "type":"chapter"
                    }]
                }
          ]
        },
        {
          "name":"Problem Set 2",
          "type":"task"
        },
        {
          "name":"Test 2",
          "type":"task"

        }
      ]
    }

    var nd =   {
      "name":"Natural Deduction",
      "type":"module",
      "children":[
        {
          "name":"Web Assignments",
          "type":"task",
          "children":[
            {
                    "name": "Reading",
                    "type":"subtask",
                    'children': [{
                        "name": "SL: Basic Rules of Inferences",
                        "type":"chapter"


                    }, {
                        "name": "SL: Hypothetical Rules of Inferences",
                        "type":"chapter",

                        "children": []
                    }, {
                        "name": "SL: Proofs and Rules of Replacements",
                        "type":"chapter",

                        "children": []
                    },
                    {
                        "name": "PL: Universal Elimination and Existential Introduction",
                        "type":"chapter",

                        "children": []
                    },
                    {
                      "name": "PL: Universal Introduction and Existential Elimination",
                      "type":"chapter",

                      "children":[]
                    }
                  ]
                }
          ]
        },
        {
          "name":"Problem Set 3",
          "type":"task",
          "children":[
            {
              "name": "SL Derviationa",
              "type":"subtask"
            },
            {
              "name": "SL Proofs and Rules of Replacements",
              "type":"subtask"

            },
            {
              "name":"PL Derviations",
              "type":"subtask"

            },
            {
              "name": "PL: Proofs",
              "type":"subtask"

            }
          ]
        },
        {
          "name":"Test 3",
          "type":"task"
        }
      ]
    }
    var id = {
      "name":"Identity and Reference",
      "type":"module",
      "children":[
        {
          "name":"Web Assignments",
          "type":"task",
          "children":[
            {
                    "name": "Reading",
                    "type":"subtask",
                    'children': [{
                        "name": "Identity in PL",
                        "type":"chapter",
                        "children": [{
                            "name": 'Beginning Translations with Identity',
                            "type":"section"


                        }, {
                            "name": 'Basic Venn Diagram',
                            "type":"section"
                        }, {
                            "name": "Concepts review",
                            "type":"section"
                        }]
                    }, {
                        "name": "Identity and Quantity",
                        "type":"chapter",
                        "children": [{
                            "name": 'Translations with Identity and Quantity',
                            "type":"section"
                        }]
                    }, {
                        "name": "Definite Descriptions",
                        "type":"chapter",
                        "children": [{
                            "name": 'Translating Definite Descriptions',
                            "type":"section"


                        }, {
                            "name": 'Quantity Statements Involving Definite Descriptions',
                            "type":"section"


                        }]
                    },
                    {
                        "name": "Models for Identity",
                        "type":"chapter",
                        "children": [{
                            "name": 'Mathematical Expressions in PL+',
                            "type":"section"

                        },
                        {
                          "name": "Proofs with Identity",
                          "type":"chapter",
                          "children": [{
                              "name": 'Using Identity Introduction and Elimination',
                              "type":"section"

                        }]
                    },
                    {
                      "name": "Trees with Identity",
                      "type":"chapter"

                    }
                  ]
                }, {
                    "name": "logicize",
                    "type":"subtask",

                    "children": [{
                        "name": "Physical Model with Identity",
                        "type":"chapter"


                    }, {
                        "name": "Model Semantics with Identity",
                        "type":"chapter"

                    }]
                }
          ]
          }
        ]
      },
      {
        "name":"Problem Set 4",
        "type":"task",

        "children":[
          {"name":"Translation",
          "type":"subtask"
        },
          {"name":"Deduction",
          "type":"subtask"

          },
          {"name":"Trees",
             "type":"subtask"
},
          {"name":"Evaluating Arguments",
           "type":"subtask"
}
        ]
      },
      {
        "name":"Test 4",
        "type":"task"

      }
    ]
  }

  var pa = {
    "name":"Participatory",
    "type":"module",
    "children":[
      {"name":"P+",
      "type":"module",
      "children":
      [
        {"name":'Test 1',"type":"task"},
        {"name":'Test 2',"type":"task"},
        {"name":'Test 3',"type":"task"},
        {"name":'Test 4',"type":"task"}
      ]
    },
      {"name": " < 3 Absences","type":"task"}

    ]
  }




    var treeData = {
      "name":"Phil 150",
      "children":[
        sl,
        pl,
        nd,
        id,
        pa
      ]
    }
    var main = '#profileTree'


    // set the dimensions and margins of the diagram
    var margin = {
            top: 50,
            right: 100,
            bottom: 50,
            left: 100
        },
        width = $(main).width()- margin.left - margin.right;
        height = 1.5*$(main).height() - margin.top - margin.bottom;

         d3.select('body').style('background','rgb(211,211,211)')
    var svg = d3.select(main).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData, function(d) {
        return d.children;
    });

    // maps the node data to the tree layout
    nodes = treemap(nodes);




    // adds the links between the nodes
    var link = g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", function(d) {
          console.log(d)
            return "white";
        })
        .attr('stroke-width',function(d){
          return 20*1/(d.depth + 1)
        })
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x +
                "C" + (d.y + d.parent.y) / 2 + "," + d.x +
                " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
                " " + d.parent.y + "," + d.parent.x;
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
            return "translate(" + d.y + "," + d.x + ")";
        });

    // adds the circle to the node
    node.append("circle")
        .attr("r", function(d) {
          // console.log(d)
            return  20*1/(d.depth + 1);
        })
        .style("stroke", function(d) {
            return color[d.data.type];
        })
        .style("fill", function(d) {
            return '#eee';
        })
        .style('stroke-width',function(d){
          return 10*1/(d.depth + 1)
        });

    // adds the text to the node
    node.append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children ?
                 -20: 10
        })
        .style("text-anchor", function(d) {
            return d.children ? "end" : "start";
        })
        .text(function(d) {
            return d.data.name;
        });

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .call(d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on("zoom", zoomed));

    function zoomed() {
      g.attr("transform", d3.event.transform);
    }
})

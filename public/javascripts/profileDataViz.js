$(function() {


    navInfo = d3.select('#navInfo')
    completeColor = "#444C5C"
    var readinEx = 1;
    var logicize = 2;
    var ass = 6;
    var test = 7
    var pa = 3
    root = {
        "name": "profile",
        "children": [

            {
                "name": "Sentence Logic",
                "children": [{
                        "name": "Reading Exercise",
                        'children': [{
                            "name": "Introduction: Validity and Venn Diagrams",
                            "children": [{
                                "name": 'Logic as the systemtic evaluation of arguments',
                                "size": readinEx,
                                "status": "complete"
                            }, {
                                "name": 'Euler and Venn Diagrams',
                                "size": readinEx
                            }, {
                                "name": "Aristotelian logic and categorical statements",
                                "size": readinEx
                            }]
                        }, {
                            "name": "Concepts of Deductive Logic",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "Symbolization",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "Truth Trees (Semantic Tableaux)",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }]
                    }, {
                        "name": "logicize",
                        "children": [{
                            "name": "Venn Diagram and Syllogistic Validity",
                            "size": logicize
                        }, {
                            "name": "Wason Selection Task",
                            "size": logicize
                        }, {
                            "name": "Puzzles",
                            "size": logicize
                        }, {
                            "name": "Using Truth Trees",
                            "size": logicize
                        }]
                    }, {
                        "name": "assignment",
                        "children": [{
                                "name": "incomplete",
                                "size": ass
                            }

                        ]
                    }, {
                        "name": "test",
                        "children": [{
                                "name": "not passed",
                                "size": test
                            }

                        ]
                    }

                ]
            }, {
                "name": "Predicate Logic",
                "children": [{
                        "name": "reading",
                        "children": [{
                                "name": "Introduction to Predicate Logic and its Syntax",
                                "children:": [{
                                        "name": 'section1',
                                        "size": readinEx
                                    }, {
                                        "name": 'section2',
                                        "size": readinEx
                                    }

                                ]
                            }, {
                                "name": "Quantifiers",
                                "children": [{
                                    "name": 'section1',
                                    "size": readinEx
                                }, {
                                    "name": 'section2',
                                    "size": readinEx
                                }]
                            }, {
                                "name": "Semantics and Models",
                                "children": [{
                                    "name": 'section1',
                                    "size": readinEx
                                }, {
                                    "name": 'section2',
                                    "size": readinEx
                                }]
                            }, {
                                "name": "Truth Trees for Predicate Logic",
                                "children": [{
                                    "name": 'section1',
                                    "size": readinEx
                                }, {
                                    "name": 'section2',
                                    "size": readinEx
                                }]
                            }

                        ]
                    }, {
                        "name": "logicize",
                        "children": [{
                            "name": "Logical puzzles with quantities",
                            "size": logicize
                        }, {
                            "name": "Model Interpretation",
                            "size": logicize
                        }]
                    }, {
                        "name": "assignment",
                        "children": [{
                                "name": "incomplete",
                                "size": ass
                            }

                        ]
                    }, {
                        "name": "test",
                        "children": [{
                                "name": "not passed",
                                "size": test
                            }

                        ]
                    }

                ]
            }, {
                "name": "Natural Deduction",
                "children": [{
                        "name": "reading",
                        "children": [{
                            "name": "SL: Basic Rules of Inferences",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "SL: Hypothetical Rules of Inferences",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "SL: Derived Rules and Logical Laws",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "SL: Proofs",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "PL: Universal Elimination and Existential Introduction",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "PL: Universal Introduction and Existential Elimination",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "PL: Proofs",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }]
                    }, {
                        "name": "logicize",
                        "children": [{
                            "name": "Proof Completion",
                            "size": logicize
                        }]
                    }, {
                        "name": "assignment",
                        "children": [{
                                "name": "incomplete",
                                "size": ass
                            }

                        ]
                    }, {
                        "name": "test",
                        "children": [{
                                "name": "not passed",
                                "size": test
                            }

                        ]
                    }

                ]
            }, {
                "name": "Identity, Descriptions, and Functions",
                "children": [{
                        "name": "reading",
                        "children": [{
                            "name": "The Identity Symbol",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "Expressing Quantities in PL",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "Definite Descriptions",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "Quantities with Definite Descriptions",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "Identity: Model Semantics",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "Functions in PL",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }, {
                            "name": "Proofs with Identity",
                            "children": [{
                                "name": 'section1',
                                "size": readinEx
                            }, {
                                "name": 'section2',
                                "size": readinEx
                            }]
                        }]
                    }, {
                        "name": "logicize",
                        "children": [{
                            "name": "Grid",
                            "size": logicize
                        }, {
                            "name": "Model Interpretation with Identity",
                            "size": logicize
                        }]
                    }, {
                        "name": "assignment",
                        "children": [{
                                "name": "incomplete",
                                "size": ass
                            }

                        ]
                    }, {
                        "name": "test",
                        "children": [{
                                "name": "not passed",
                                "size": test
                            }

                        ]
                    }

                ]
            }, {
                "name": "Participatory",
                "children": [{
                        "name": "1",
                        "children": [{
                            "name": "incomplete",
                            "size": pa
                        }]
                    }, {
                        "name": "2",
                        "children": [{
                            "name": "incomplete",
                            "size": pa
                        }]
                    }, {
                        "name": "3",
                        "children": [{
                            "name": "incomplete",
                            "size": pa
                        }]
                    }, {
                        "name": "4",
                        "children": [{
                            "name": "incomplete",
                            "size": pa
                        }]
                    }

                ]
            }


        ]
    }



    var width = $('#profileMid').width(),
        height = 700,
        radius = (Math.min(width, height) / 2) - 10;

    var formatNumber = d3.format(",d");

    var x = d3.scaleLinear()
        .range([0, 2 * Math.PI]);

    var y = d3.scaleSqrt()
        .range([0, radius]);

    var color = d3.scaleOrdinal(d3.schemeSet3);
    // var color2 = d3.scaleSequential(d3.interpolateBrBG)
    var slc = d3.scaleSequential(d3.interpolateBuPu)
    var plc = d3.scaleSequential(d3.interpolatePuRd)
    var ndc = d3.scaleSequential(d3.interpolateYlGnBu)
    var idc = d3.scaleSequential(d3.interpolateYlGn)
    var pc = d3.scaleSequential(d3.interpolateGreys)

    colS = {
        "Sentence Logic": slc,
        "Predicate Logic": plc,
        "Natural Deduction": ndc,
        "Identity, Descriptions, and Functions": idc,
        "Participatory": pc
    }

    var partition = d3.partition();

    var arc = d3.arc()
        .startAngle(function(d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
        })
        .endAngle(function(d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
        })
        .innerRadius(function(d) {
            return Math.max(0, y(d.y0));
        })
        .outerRadius(function(d) {
            return Math.max(0, y(d.y1));
        });

    function findModule(d) {
        if (d.parent.data.name == "profile") return d.data.name;
        else return findModule(d.parent)
    }

    var svg = d3.select("#profileMid").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");


    root = d3.hierarchy(root);
    root.sum(function(d) {
        return d.size;
    });
    svg.selectAll("path")
        .data(partition(root).descendants())
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) {
            // console.log(d)
            if (d.data.name == "profile") return "white"
            else if (d.data.status == "complete") return completeColor
            else {
                return colS[findModule(d)](1.6 / d.depth)


            }
        })
        .style("stroke", function(d) {
            return "#fff"
        })
        .style('stroke-width', '3')
        .style("opacity", 0.7)
        .on("click", click)
        .on("mouseover", function(d) {

            var sequenceArray = getAncestors(d);
            navInfo.text(d.data.name)

            d3.selectAll("path")
                .filter(function(node) {

                    return (sequenceArray.indexOf(node) >= 0);
                })
                .style("opacity", 2);

        })
        .on("mouseout", function() {
            d3.selectAll("path").style("opacity", .8)

        })
        .append("title")
        .text(function(d) {
            return d.data.name + "\n" + formatNumber(d.value);
        });


    function getAncestors(node) {
        var path = [];
        var current = node;
        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    }


    function click(d) {
        svg.transition()
            .duration(750)
            .tween("scale", function() {
                var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]),
                    yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                return function(t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                };
            })
            .selectAll("path")
            .attrTween("d", function(d) {
                return function() {
                    return arc(d);
                };
            });
    }

    d3.select(self.frameElement).style("height", height + "px");
})

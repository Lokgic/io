$(function(){
  var grade = [
        { title: 18, grade: "A+"},
        { title: 16, grade: "A"},
        { title: 14, grade: "A-"},
        { title: 13, grade: "B+"},
        { title: 12, grade: "B"},
        { title: 11, grade: "B-"},
        { title: 10, grade: "C+"},
        { title: 9, grade: "C"},
        { title: 8, grade: "C-"},
        { title: 7, grade: "D+"},
        { title: 6, grade: "D"},
        { title: 5, grade: "F"}

    ];

    var task = [
          { title: "Web exercises (each module)",total:4},
          { title: "problem-set",total:4},
          { title: "Passing a test (P)",total: 4},
          { title: "Perfecting a test (P+)",total: 4},
          { title: "3 or less absences",total: 1},
          { title: "Class Activities",total: 1},
          { title: "Logicizes achievements",total: "TBD"}

      ];

  var columns = [
    { head: 'Tasks Completed', cl: 'title',
      html: function(row) { return row.title; } },
    { head: 'Grade', cl: 'grade',
      html: function(row) { return row.grade; } }
    ];

    var columns2 = [
      { head: 'Tasks ', cl: 'task',
        html: function(row) { return row.title; } },

      { head: 'Available', cl: 'total',
        html: function(row) { return row.total; } }
      ];
    // create table
   var table = d3.select('#gradeTable')
       .append('table');

   // create table header
   table.append('thead').append('tr')
       .selectAll('th')
       .data(columns).enter()
       .append('th')
       .attr('class', function(d){ return d.cl})
       .text(function(d){ return d.head});

   // create table body
   table.append('tbody')
       .selectAll('tr')
       .data(grade).enter()
       .append('tr')
       .selectAll('td')
       .data(function(row, i) {
           return columns.map(function(c) {
               // compute cell values for this specific row
               var cell = {};
               d3.keys(c).forEach(function(k) {
                   cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
               });
               return cell;
           });
       }).enter()
       .append('td')
       .html(function(d){ return d.html})
       .attr('class', function(d){ return d.cl});

   function length() {
       var fmt = d3.format('02d');
       return function(l) { return Math.floor(l / 60) + ':' + fmt(l % 60) + ''; };
   }


   var tablea = d3.select('#taskTable')
       .append('table');

   // create table header
   tablea.append('thead').append('tr')
       .selectAll('th')
       .data(columns2).enter()
       .append('th')
       .attr('class', function(d){ return d.cl})
       .text(function(d){ return d.head});

   // create table body
   tablea.append('tbody')
       .selectAll('tr')
       .data(task).enter()
       .append('tr')
       .selectAll('td')
       .data(function(row, i) {
           return columns2.map(function(c) {
               // compute cell values for this specific row
               var cell = {};
               d3.keys(c).forEach(function(k) {
                   cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
               });
               return cell;
           });
       }).enter()
       .append('td')
       .html(function(d){ return d.html})
       .attr('class', function(d){ return d.cl});

   function length() {
       var fmt = d3.format('02d');
       return function(l) { return Math.floor(l / 60) + ':' + fmt(l % 60) + ''; };
   }
   //
  //  var svg = d3.select("#gradeChart").append('svg'),
  //      margin = {top: 20, right: 20, bottom: 30, left: 50},
  //      width = 500
  //      height = 500
  //      svg.attr('height',500).attr('width',500)
  //      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //  var parseTime = d3.timeParse("%d-%b-%y");
//
//    var x = d3.scaleBand().domain(["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","F"]).range([width-70,0]);
//
//    var y = d3.scaleLinear()
//           .domain([18,0])
//           .range([ 0,height-70]);
//
// // console.log(x("B"))
//   grade2 = []
//
//   for (var i = grade.length; i >1;i--){
//     console.log("Test")
//     grade2.push(grade[i-1])
//   }
//    var line = d3.line()
//        .x(function(d) { return x(d.grade); })
//        .y(function(d) { return y(d.title); });
//
//        console.log(grade.length)
//
//
//
//
//      g.append("g")
//          .attr("class", "axis axis--x")
//          .attr("transform", "translate(0," + height + ")")
//          .call(d3.axisBottom(x));
//
//      g.append("g")
//          .attr("class", "axis axis--y")
//          .call(d3.axisLeft(y))
//        .append("text")
//          .attr("fill", "#000")
//          .attr("transform", "rotate(-90)")
//          .attr("y", 6)
//          .attr("dy", "0.71em")
//          .style("text-anchor", "end")
//          .text("Price ($)");
//
//      g.append("path")
//          .datum(grade2)
//          .attr("class", "line")
//          .attr("d", line);
//












})

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
  








})

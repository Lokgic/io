$(function(){
  // The table generation function
    function tabulate(data,div) {
        var columns = [        ]
        data.forEach(function(i){
          columns.push(i.name)
        })
        var table = d3.select(div).append("table")

            thead = table.append("thead"),
            tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
                .text(function(column) { return column; });

          var rows = []

          for (var i = 0;i<data[0].column.length;i++){
            var content = []
            for (var j = 0 ; j<columns.length;j++){
              content.push(data[j].column[i])
            }
            rows.push(content)
          }
          console.log(rows)
      //  create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(rows)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(cell) {
                return cell
            })
            .enter()
            .append("td")
            .attr("style", "font-family: Courier") // sets the font style
                .html(function(d) {
                  console.log(d)
                  return d; });

        return table;
    }

  data = [
    {
      "name":"A",
      "column":["T","T","F","F"]
    },
    {
      "name":"B",
      "column":["T","F","T","F"]
    }
  ]
  tabulate(data,".table")
})

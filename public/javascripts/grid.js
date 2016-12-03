$(function(){

  jQuery.post("../processing/grid",function(model){
    console.log(model.grid)
    for (row in model.grid){
      for (col in model.grid[row]){
        // console.log(row+"_"+col)
        $("#"+row+"_"+col).text(model.grid[row][col])
      }
    }
  });

})

module.exports.search = function treeSearch(element, key, property){
  // console.log("searching..")
     if(element[key] == property){
          return element;
     }else if (element.children != null){
          var i;
          var result = null;
          for(i=0; result == null && i < element.children.length; i++){
               result = treeSearch(element.children[i], key,property);
          }
          return result;
     }
    //  console.log("returning null for " + element[0])

     return null;
}

module.exports.checkChildren = function checkChildren(element){
  console.log("checking children..")
  console.log(element)
  console.log("completed status")
  console.log(element.completed)
   if (element.children != null){

          var i;
          var result = null;
          for(i=0;  i < element.children.length; i++){
            // console.log("checking child of " + element.name +": " +"element.children[i].name")
               result = checkChildren(element.children[i]);
              //  console.log("result is " + " " +result)
               if (!result) return false;
          }
          element.completed = true;
          return true;
     }else if (element.completed == true){

          return true;
     }else if(element.completed==false){
          // element.completed = false;

          return false;
     }
     return null;
}


module.exports.searchTask = function searchTask(element){
  var completed = []

    function find(element){
      if(element.type === "task"){
        if (element.completed){
          completed.push({"name":element.name})
        }
      } else if (element.children != null){
           var i;
           for(i=0;  i < element.children.length; i++){
                find(element.children[i]);
           }
      }
    }
    find(element)
    // console.log(completed)

    return completed;
  // console.log(element)

}

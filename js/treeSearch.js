module.exports.search = function treeSearch(element, key, property){
  // console.log(element)
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
     return null;
}

module.exports.checkChildren = function checkChildren(element){
  // console.log(element)
     if (element.completed == true){
          return true;
     }else if(element.children.length == 0|| element.children==null){
          element.completed = false;
          return false;
     }else if (element.children != null){
          var i;
          var result = null;
          for(i=0;  i < element.children.length; i++){
               result = checkChildren(element.children[i]);
               if (!result) return false;
          }
          element.completed = true;
          return true;
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

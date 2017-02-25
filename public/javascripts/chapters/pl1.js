$(function(){

  makeDefMatch("pl-1-matching")
  mathJax.reload('pl-1-matching')
  // makeDefMatch("pl-1-def")

  //
  // loadProblems("pl/1/def",function(error, data){
  //   if (error) console.log(error);
  //   else{
  //     console.log(data)
  //     var obj = new dragMatchingExercise("pl-1-def", data);
  //   }
  // })
  textInputInit();
})

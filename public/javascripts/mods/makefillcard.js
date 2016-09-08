var makefillCard = function makefillCard(obj){
  var html = '<div class="card" id ="'+ obj.id + '"><h1 class="card-header display-4">' + obj.section +". " + obj.title +  '</h1><div class="card-block fillcard">';
  html += '<p class="font-italic">' + obj.instruction +'<p>';
  html += '<form>';
  for (var i = 0;i<obj.questions.length;i++){
    
    html += '<div class="form-group">';
    html += '<label id = "'+ obj.id +i+'label" for="'+ obj.id +i+'">' + obj.questions[i][0]+'</label>';
    html +=  '<input type="text" class="form-control" id="'+ obj.id+i+'" placeholder="Type answer here"></div>';
  }

  html += '</form>';

  html +='<button class="btn btn-primary btn-lg btn-block m-t-1 m-b-1" id=' + obj.id +  'submit type="button">Submit</button>'

  return html;
}


module.exports = makefillCard;
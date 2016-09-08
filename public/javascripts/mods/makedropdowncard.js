var makeDropdownCard =  function makeDropdownCard(obj){
  dropdownItems += '<option>Answer</option>';
    var dropdownItems;
    for (var i = 0; i < obj.possibleAnswers.length; i++){
      dropdownItems += '<option value ='+obj.possibleAnswers[i]+'>' + obj.possibleAnswers[i] + '</option>';
    }

    var html = '<div class="card" id ="'+ obj.id + '"><h1 class="card-header display-4">' + obj.section +". " + obj.title +  '</h1><div class="p-x-2 card-block dropdowncard">';
    html += '<p class="font-italic">' + obj.instruction +'<p>';
 	 html += '<form>';
     
     for (var i = 0;i<obj.questions.length;i++){
      var tempLabel = obj.id + i; 
       html += '<div class="form-group row">';
        html += '<label id = ' + tempLabel +'label class="col-md-10 col-form-label col-xs-12" for = ' + tempLabel + '>' + obj.questions[i][0] + '</label>'
       html+= '<div class= "col-md-4 col-xs-12"><select class="form-control" id ='+ tempLabel +'>';
       html += dropdownItems;
       html += '</select></div></div>'

     }

     html += '</form>';

  html +='<button class="btn btn-primary btn-lg btn-block m-t-1 m-b-1" id=' + obj.id +  'submit type="button">Submit</button>'

     return html;
  }


module.exports = makeDropdownCard;
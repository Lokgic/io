var makeGameCard = function makeGameCard(obj){
   var html = '<div class="card" id ="'+ obj.id + '"><h1 class="card-header display-4">' + obj.section +". " + obj.title +  '</h1><div class="p-x-2 card-block dropdowncard">';
    html += '<p class="font-italic">' + obj.instruction +'<p>';
    html += '<a class="btn btn-primary" href="../'+ obj.moduleNo + '/' + obj.id + '" role="button">Link</a>';
    html += '</div>'
    return html;
}





module.exports = makeGameCard;

var makeCard = function makeCard(id) {
    html = '<div class="card" id = "card'+id + '"><div class="card-header" id = header' + id + '></div>'
    html += '<div class="card-block" id = "block' + id + '"></div>'
    html += '<div class= "card-footer" id = footer' + id + '></div>'
    html += '</div>'

    return html;
}


var makeModal = function makeModal(id) {

    var button = '<button class="btn btn-primary" data-toggle="modal" data-target=".modalcontainer' + id + '" id = modalbutton' + id + '>Modal</button>';



    var content = '<div class="modal fade modalcontainer' + id + '" tabindex="-1" role="dialog" aria-labelledby="modalheader' + id + '" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content" id = "modalcontent' + id + '"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="modaltitle' + id + '">Modal title</h4></div><div class ="modal-body" id = "modalmain' + id + '"</div></div></div></div>';
    return [button, content];

}


module.exports = {
    makeCard: makeCard,
    makeModal: makeModal
};

$(function(){
	$pass = $('.passbutton');

	$pass.on('click', function(e){
		var i = this.getAttribute("value");
		var id = getParameterByName("id");
		jQuery.post("../reportTest", {id: id, passed: true, label: "test", moduleNo: i}, function(res){
				      });
		location.reload();
	})

})

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
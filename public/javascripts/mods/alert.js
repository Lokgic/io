var makeAlert = function(location, direction, text, code){ //direction: a= above, b=below
  /////This takes care of the HTML
  var tag;
  if (code == 0){
	if (direction == "a"){
        // $(location).prev().html("");
          $(location).prev('.alert').remove();
        }
      if (direction == "b"){
          // $(location).next().html("")
          $(location).next('.alert').remove();
        }

  }else{
    switch(code){
      case 1: tag = "alert-success";
      break;
      case 2: tag = "alert-info";
      break;
      case 3: tag = "alert-warning"
      break;
      case 4: tag = "alert-danger"
    }
    console.log(tag)
  var html = "<div class='alert " + tag +  " alert-dismissible fade in m-x-1' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+text+"</div>";

  if (direction == "a"){
    if ($(location).prev().hasClass("alert")) {
      $(location).prev().remove();
    }
    $(location).before(html);
    }

  if (direction == "b"){
    if ($(location).next().hasClass("alert")) {
      $(location).next().remove();
    }
    $(location).after(html);
    }}

  }

 module.exports = makeAlert;

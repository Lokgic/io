$('[data-toggle="tooltip"]').tooltip()



jQuery.post("/progress",  function(res){

  for (var i = 0;i < 48;i++){

    moduleNo = Math.trunc(i/6) + 1;
    title = "<p class = 'display-4'>"+ moduleNo + "</p>";
    ex = i - (6*(moduleNo-1))
    switch (ex) {
      case 0: title += "<p class = 'lead text-xs-center'> Reading Exercise I</p><p id = 'bar_status"+i+"'>Status: Incomplete</p>"
      break;
      case 1:
      title += " <p class = 'lead text-xs-center'>Reading Exercise II</p><p id = 'bar_status"+i+"'>Status: Incomplete</p>"
      break;
      case 2:
      title += " <p class = 'lead text-xs-center'>Reading Exercise III</p><p id = 'bar_status"+i+"'>Status: Incomplete</p>"
      break
      case 3:
      title += "<p class = 'lead text-xs-center'> Cocnepts Quiz</p><p id = 'bar_status"+i+"'>Status: Incomplete</p>"
      break;
      case 4:
      title += " <p class = 'lead text-xs-center'>Logic Quiz</p><p id = 'bar_status"+i+"'>Status: Incomplete</p>"
      break;
      case 5:
      title += "<p class = 'lead text-xs-center'> Module Test</p><p id = 'bar_status"+i+"'>Status: Incomplete</p>"
      break;
    }
    // $('#bar_'+n).addClass('progressBar_passed')

    $('#bar_'+i).tooltip('hide')
        .attr('data-original-title', title)

  }
    for (record in res){
      n = 0;



      target = res[record]

      title = "<p class = 'display-4'>"+ target.moduleNo + "</p>";
      date = target.created_at.split('-')
      formatted = date[1] + "-" + date[2][0] + date[2][1] + '-' + date[0]

// formatted will be 'Jul 8, 2014'
      base = res[record].moduleNo * 6 - 6
      switch (target.label) {

        case "reading_1": title += " <p class = 'lead text-xs-center'>Reading Exercise I</p><p>Status: Completed</p><p> Date: " +formatted + "</p>"
        n = base
        break;
        case "reading_2": n = base + 1;
        title += " <p class = 'lead text-xs-center'>Reading Exercise II</p><p>Status: Completed</p><p> Date: " +formatted + "</p>"
        break;
        case "reading_3": n = base + 2;
        title += " <p class = 'lead text-xs-center'>Reading Exercise III</p><p>Status: Completed</p>Date: "+formatted + "</p>"
        break;
        case "concepts": n = base + 3;
        title += " <p class =' lead text-xs-center'>Concepts Quiz </p><p>Status: Completed</p>Date: "+formatted + "</p>"
        break;
        case "quiz": n = base + 4;
        title += "  <p class = 'lead text-xs-center'>Logic Quiz </p><p>Status: Completed</p>Date: "+formatted + "</p>"
        break;
        case "test":n = base + 5;
        title +=  "<p class = 'lead text-xs-center'> Module Test </p><p>Status: Completed</p>Date: "+formatted + "</p>"
        break;
      }

      $('#bar_'+n).addClass('progressBar_passed')

      $('#bar_'+n).tooltip('hide')
          .attr('data-original-title', title)

    }

     });

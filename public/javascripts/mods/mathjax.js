var mathJax = {
  load: function () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
  document.getElementsByTagName("head")[0].appendChild(script);
  },
  reload: function(id){
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,id]);

  }
}



module.exports = mathJax;
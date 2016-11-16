var dot = require("./lib/dot");
var pullquote_template = dot.compile(require("../partials/_pullquote.html"));

var s = document.getElementById("statement");

var count = 0;
function changeText() {
	  s.style.opacity = 0;

	  var last = +new Date();
	  var tick = function() {
	    s.style.opacity = +s.style.opacity + (new Date() - last) / 1000;
	    last = +new Date();

	    if (s.style.opacity < 1) {
	      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
	    }
	  };

	  tick();

    s.innerHTML = pullquote_template(srosTextData[count]);
    count < srosTextData.length - 1 ? count++ : count = 0;
}

changeText();
setInterval(changeText,6000);

var venn = require("venn.js");
var d3 = require('d3');
var $ = require("jquery");

var colours = ['#493843','#D13D59','#FFCC32','#DE8067','#80A9D0','#FFCC32','#846A6A','#996B7D','#DE8067'];
var sets_list = [" No diagnosis"," Medical"," Mental health"," Substance abuse"];

var duration = 1000;

if (screen.width > 768) {
  var width = 600;
  var height = 350;
  var padding = 15;
} else if (screen.width <= 768 && screen.width > 480) {
  var width = 600;
  var height = 350;
  var padding = 15;
} else if (screen.width <= 480) {
  var width = 320;
  var height = 250;
  var padding = 27;
}

var setsONEPERCENT = [
             {sets: [0], label: "No diagnosis: 6.8%", size: 6.8, percent: 6.8}, //no diagnosis
             {sets: [1], label:'Medical', size: 77.5, percent: 1.5}, //medical
             {sets: [2], label:'Mental', size: 80.2, percent: 3.3}, //psych
             {sets: [3], label: 'Substance abuse', size: 84.3, percent: 3.3}, //substance abuse
             {sets: [0,1], size: 0},
             {sets: [0,2], size: 0},
             {sets: [0,3], size: 0},
             {sets: [1,2], size: 4.1+63.6, percent: 4.1},
             {sets: [1,3], size: 8.3+63.6, percent: 8.3},
             {sets: [2,3], size: 9.2+63.6, percent: 9.2},
             {sets: [0,1,2], size: 0},
             {sets: [0,1,3], size: 0},
             {sets: [1,2,3], label: 'Medical, mental and substance abuse: 63.6%', size: 63.6, percent: 63.6},
             {sets: [0,1,2,3], size: 0}
           ];

var setsALL = [ {sets: [0], label: "No diagnosis: 26.0%", size: 26.0, percent: 26.0}, // no diagnosis
            {sets: [1], label:'Medical', size: 48.1, percent: 4.7}, // medical
            {sets: [2], label:'Mental health', size: 53.1, percent: 5.9}, // psych
            {sets: [3], label: 'Substance abuse', size: 58.7, percent: 7.8}, //substance abuse
            {sets: [0,1], size: 0},
            {sets: [0,2], size: 0},
            {sets: [0,3], size: 0},
            {sets: [1,2], size: 4.7+30.3, percent: 4.7},
            {sets: [1,3], size: 8.4+30.3, percent: 8.4},
            {sets: [2,3], size: 12.2+30.3, percent: 12.2},
            {sets: [0,1,2], size: 0},
            {sets: [0,1,3], size: 0},
            {sets: [1,2,3], label: 'Medical, mental and substance abuse: 30.3%', size: 30.3, percent: 30.3},
            {sets: [0,1,2,3], size: 0}
          ];

var chart = venn.VennDiagram(width,height,padding,duration);
d3.select("#bubbles").datum(setsALL).call(chart);
var vennselect = d3.select("#bubbles")

// add a tooltip
// var tooltip = document.querySelector(".tooltip");

// show tooltip
var bubblestooltip = d3.select("#bubbles")
    .append("div")
    .attr("class","bubblestooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")

$("#all").click(function() {
  d3.select("#bubbles").datum(setsALL).call(chart);
  d3.selectAll("#bubbles label").style("text-anchor","end !important");
  $("#all").addClass("selected");
  $("#one").removeClass("selected");
  $("#legend-all").addClass("selected");
  $("#legend-onepercent").removeClass("selected");
});

$("#one").click(function() {
  d3.select("#bubbles").datum(setsONEPERCENT).call(chart);
  d3.selectAll("#bubbles label").style("text-anchor","end !important");
  $("#all").removeClass("selected");
  $("#one").addClass("selected");
  $("#legend-all").removeClass("selected");
  $("#legend-onepercent").addClass("selected");
});

d3.selectAll("#bubbles .venn-circle path")
    .style("fill-opacity", .6)
    .style("fill",function(d,i) {
      return colours[i]
    });

d3.selectAll("#bubbles .venn-circle path")
    //  .style("fill-opacity", 0)
     .style("stroke-width", 2)
     .style("stroke-opacity", 1)
     .style("stroke", function(d,i) { return colours[i]; });

d3.selectAll("#bubbles text").style("fill", "black");
d3.selectAll("#bubbles label").style("text-anchor","end !important");

// add listeners to all the groups to display tooltip on mouseover
vennselect.selectAll("g")
    .on("mouseover", function(d) {
       var new_label = [];
       for (var idx=0; idx < d.sets.length; idx++) {
         console.log(idx);
         console.log(sets_list[d.sets[idx]]);
         new_label.push(sets_list[d.sets[idx]]);
       }
       console.log(new_label);
       bubblestooltip.html(`
         <div>${new_label}</div>
         <div>${d.percent}%</div>
      `);
       bubblestooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return bubblestooltip
          .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
          .style("left",10+"px");
      } else {
        return bubblestooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-80)+"px");
      }
    })
    .on("mouseout", function(){
      return bubblestooltip.style("visibility", "hidden");
    });

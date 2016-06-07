var venn = require("venn.js");
var d3 = require('d3');

var colours = ['#493843','#DE8067','#FFCC32','#667A96','#80A9D0','#FFCC32','#846A6A','#996B7D','#DE8067'];

var sets = [ {sets: [0], label: "No diagnosis", size: 6.8},
             {sets: [1], label:'Medical', size: 77.5},
             {sets: [2], label:'Psych', size: 80.2},
             {sets: [3], label: 'Substance abuse', size: 84.3},
             {sets: [0,1], size: 0},
             {sets: [0,2], size: 0},
             {sets: [0,3], size: 0},
             {sets: [1,2], size: 4.1+63.6},
             {sets: [1,3], size: 8.3+63.6},
             {sets: [2,3], size: 9.2+63.6},
             {sets: [0,1,2], size: 0},
             {sets: [0,1,3], size: 0},
             {sets: [1,2,3], size: 63.6},
             {sets: [0,1,2,3], size: 0}
           ];

var chart = venn.VennDiagram()
d3.select("#bubbles").datum(sets).call(chart);


d3.selectAll("#bubbles .venn-circle path")
    .style("fill-opacity", .4)
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

var sets = [ {sets: [0], label: "No diagnosis", size: 26.0},
             {sets: [1], label:'Medical', size: 48.1},
             {sets: [2], label:'Psych', size: 53.1},
             {sets: [3], label: 'Substance abuse', size: 58.7},
             {sets: [0,1], size: 0},
             {sets: [0,2], size: 0},
             {sets: [0,3], size: 0},
             {sets: [1,2], size: 4.7+30.3},
             {sets: [1,3], size: 8.4+30.3},
             {sets: [2,3], size: 12.2+30.3},
             {sets: [0,1,2], size: 0},
             {sets: [0,1,3], size: 0},
             {sets: [1,2,3], size: 30.3},
             {sets: [0,1,2,3], size: 0}
           ];

var chartAll = venn.VennDiagram()
d3.select("#bubblesAll").datum(sets).call(chartAll);

d3.selectAll("#bubblesAll .venn-circle path")
    .style("fill-opacity", .4)
    .style("fill",function(d,i) {
      return colours[i]
    });

d3.selectAll("#bubblesAll .venn-circle path")
    //  .style("fill-opacity", 0)
     .style("stroke-width", 2)
     .style("stroke-opacity", 1)
     .style("stroke", function(d,i) { return colours[i]; });

d3.selectAll("#bubblesAll text").style("fill", "black");
d3.selectAll("#bubblesAll label").style("text-anchor","end !important");



//         return '#493843'
//       } else if (d.name == "No diagnosis") {
//         return '#667A96'
//       } else if (d.name == "Medical only") {
//         return '#889C6B'
//       } else if (d.name == "Psych only") {
//         return '#80A9D0'
//       } else if (d.name == "Substance abuse only") {
//         return '#EB8F6A'
//       } else if (d.name == "Medical / Substance abuse") {
//         return '#FFCC32'
//       } else if (d.name == "Medical / Psych") {
//         return '#846A6A'
//       } else if (d.name == "Psych / Substance abuse") {
//         return '#996B7D'
//       } else if (d.name == "Tri-morbidity") {
//         return '#DE8067'
//       } else {
//         return 'white'//'#493843'
// var d3 = require('d3');
//
// // bubble graph ----------------------------------------------------------------
//
// if (screen.width > 768) {
//   var diameter = 400;
//   var topbuffer = 20;
// } else if (screen.width <= 768 && screen.width > 480) {
//   var diameter = 400;
//   var topbuffer = 20;
// } else if (screen.width <= 480) {
//   var diameter = 360,
//       dropdown = document.querySelector("select");
//   var margin = {
//     right: 5,
//     left: 5
//   }
//   var topbuffer = 20;
// }
//
// var pack = d3.layout.pack()
//     .size([diameter, diameter])
//     .padding(4)
//     .value(function(d) { return d.percent; });
//
// var svg = d3.select(".bubbles").append('svg')
//   .attr('width', diameter)
//   .attr('height', diameter)
//   .attr('class','pack')
//   .append("g");
//
// var tooltip = document.querySelector(".tooltip");
// var data = illnessData1Percent;
//
// var node = svg.data([data]).selectAll("circle")
//     .data(pack.nodes)
//   .enter().append("circle")
//     .attr("class", "node")
//     .attr("cx", function(d) { return d.x; })
//     .attr("cy", function(d) { return d.y; })
//     .attr("r", function(d) { return d.r; })
//     .style("fill", function(d) {
//       if (d.name == "sick") {
//         return '#493843'
//       } else if (d.name == "No diagnosis") {
//         return '#667A96'
//       } else if (d.name == "Medical only") {
//         return '#889C6B'
//       } else if (d.name == "Psych only") {
//         return '#80A9D0'
//       } else if (d.name == "Substance abuse only") {
//         return '#EB8F6A'
//       } else if (d.name == "Medical / Substance abuse") {
//         return '#FFCC32'
//       } else if (d.name == "Medical / Psych") {
//         return '#846A6A'
//       } else if (d.name == "Psych / Substance abuse") {
//         return '#996B7D'
//       } else if (d.name == "Tri-morbidity") {
//         return '#DE8067'
//       } else {
//         return 'white'//'#493843'
//       }
//     })
//     .on("mouseover", function(d) {
//         tooltip.classList.add("show");
//         if (d.percent){
//           tooltip.innerHTML = `
//             <div>Illness: ${d.name}</div>
//             <div>Percent: ${d.percent}</div>
//           `;
//         } else {
//           tooltip.classList.remove("show");
//         }
//     })
//     .on("mouseout", function(){
//       tooltip.classList.remove("show");
//     });
//
//
// svg.selectAll("text")
//     .data(pack.nodes)
//   .enter().append("svg:text")
//     .attr("x", function(d) { return d.x; })
//     .attr("y", function(d) { return d.y; })
//     .attr("dy", ".35em")
//     .attr("text-anchor", "middle")
//     .text(function(d) { return d.percent; });
//
// // get tooltip to move with cursor
// document.querySelector(".bubbles").addEventListener("mousemove", function(e) {
//   var bounds = this.getBoundingClientRect();
//   var x = e.clientX - bounds.left;
//   var y = e.clientY - bounds.top;
//   tooltip.style.left = x + 10 + "px";
//   tooltip.style.top = y + 700 + "px";
//
//   tooltip.classList[x > bounds.width / 2 ? "add" : "remove"]("flip");
// });
//
// var svgAll = d3.select(".bubbles-all").append('svg')
//   .attr('width', diameter)
//   .attr('height', diameter)
//   .attr('class','packall')
//   .append("g");
//   // .attr("transform", "translate(" + margin.left + "," + 0 + ")"); // giving the bubbles some padding, so that the text won't get cut off on the right and left margins
//
// // var dataAll = { illness: "category", children: illnessDataAll };
// // console.log(dataAll);
// var tooltipAll = document.querySelector(".tooltip-all");
// var dataAll = illnessDataAll;
//
// var nodeAll = svgAll.data([dataAll]).selectAll("circle")
//     .data(pack.nodes)
//   .enter().append("circle")
//     .attr("class", "node")
//     .attr("cx", function(d) { return d.x; })
//     .attr("cy", function(d) { return d.y; })
//     .attr("r", function(d) { return d.r; })
//     .style("fill", function(d) {
//       if (d.name == "sick") {
//         return '#493843'
//       } else if (d.name == "No diagnosis") {
//         return '#667A96'
//       } else if (d.name == "Medical only") {
//         return '#889C6B'
//       } else if (d.name == "Psych only") {
//         return '#80A9D0'
//       } else if (d.name == "Substance abuse only") {
//         return '#EB8F6A'
//       } else if (d.name == "Medical / Substance abuse") {
//         return '#FFCC32'
//       } else if (d.name == "Medical / Psych") {
//         return '#846A6A'
//       } else if (d.name == "Psych / Substance abuse") {
//         return '#996B7D'
//       } else if (d.name == "Tri-morbidity") {
//         return '#DE8067'
//       } else {
//         return 'white'//'#493843'
//       }
//     })
//     .on("mouseover", function(d) {
//         tooltipAll.classList.add("show");
//         if (d.percent){
//           tooltipAll.innerHTML = `
//             <div>Illness: ${d.name}</div>
//             <div>Percent: ${d.percent}</div>
//           `;
//         } else {
//           tooltipAll.classList.remove("show");
//         }
//     })
//     .on("mouseout", function(){
//       tooltipAll.classList.remove("show");
//     });
//
// svgAll.selectAll("text")
//     .data(pack.nodes)
//   .enter().append("svg:text")
//     .attr("x", function(d) { return d.x; })
//     .attr("y", function(d) { return d.y; })
//     .attr("dy", ".35em")
//     .attr("text-anchor", "middle")
//     .text(function(d) { return d.percent; });
//
// // get tooltip to move with cursor
// document.querySelector(".bubbles-all").addEventListener("mousemove", function(e) {
//   var bounds = this.getBoundingClientRect();
//   var x = e.clientX - bounds.left;
//   var y = e.clientY - bounds.top;
//   tooltipAll.style.left = x + 10 + "px";
//   tooltipAll.style.top = y + 200 + "px";
//   tooltipAll.classList[x > bounds.width / 2 ? "add" : "remove"]("flip");
// });

var d3 = require('d3');

// bubble graph ----------------------------------------------------------------

if (screen.width > 768) {
  var diameter = 400;
  var topbuffer = 20;
} else if (screen.width <= 768 && screen.width > 480) {
  var diameter = 400;
  var topbuffer = 20;
} else if (screen.width <= 480) {
  var diameter = 360,
      dropdown = document.querySelector("select");
  var margin = {
    right: 5,
    left: 5
  }
  var topbuffer = 20;
}

var pack = d3.layout.pack()
    .size([diameter, diameter])
    .padding(4)
    .value(function(d) { return d.percent; });

var svg = d3.select(".bubbles").append('svg')
  .attr('width', diameter)
  .attr('height', diameter)
  .attr('class','pack')
  .append("g");

var tooltip = document.querySelector(".tooltip");
var data = illnessData1Percent;

var node = svg.data([data]).selectAll("circle")
    .data(pack.nodes)
  .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) {
      if (d.name == "sick") {
        return '#493843'
      } else if (d.name == "No diagnosis") {
        return '#667A96'
      } else if (d.name == "Medical only") {
        return '#889C6B'
      } else if (d.name == "Psych only") {
        return '#80A9D0'
      } else if (d.name == "Substance abuse only") {
        return '#EB8F6A'
      } else if (d.name == "Medical / Substance abuse") {
        return '#FFCC32'
      } else if (d.name == "Medical / Psych") {
        return '#846A6A'
      } else if (d.name == "Psych / Substance abuse") {
        return '#996B7D'
      } else if (d.name == "Tri-morbidity") {
        return '#DE8067'
      } else {
        return 'white'//'#493843'
      }
    })
    .on("mouseover", function(d) {
        tooltip.classList.add("show");
        if (d.percent){
          tooltip.innerHTML = `
            <div>Illness: ${d.name}</div>
            <div>Percent: ${d.percent}</div>
          `;
        } else {
          tooltip.classList.remove("show");
        }
    })
    .on("mouseout", function(){
      tooltip.classList.remove("show");
    });


svg.selectAll("text")
    .data(pack.nodes)
  .enter().append("svg:text")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.percent; });

// get tooltip to move with cursor
document.querySelector(".bubbles").addEventListener("mousemove", function(e) {
  var bounds = this.getBoundingClientRect();
  var x = e.clientX - bounds.left;
  var y = e.clientY - bounds.top;
  tooltip.style.left = x + 10 + "px";
  tooltip.style.top = y + 700 + "px";

  tooltip.classList[x > bounds.width / 2 ? "add" : "remove"]("flip");
});

var svgAll = d3.select(".bubbles-all").append('svg')
  .attr('width', diameter)
  .attr('height', diameter)
  .attr('class','packall')
  .append("g");
  // .attr("transform", "translate(" + margin.left + "," + 0 + ")"); // giving the bubbles some padding, so that the text won't get cut off on the right and left margins

// var dataAll = { illness: "category", children: illnessDataAll };
// console.log(dataAll);
var tooltipAll = document.querySelector(".tooltip-all");
var dataAll = illnessDataAll;

var nodeAll = svgAll.data([dataAll]).selectAll("circle")
    .data(pack.nodes)
  .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) {
      if (d.name == "sick") {
        return '#493843'
      } else if (d.name == "No diagnosis") {
        return '#667A96'
      } else if (d.name == "Medical only") {
        return '#889C6B'
      } else if (d.name == "Psych only") {
        return '#80A9D0'
      } else if (d.name == "Substance abuse only") {
        return '#EB8F6A'
      } else if (d.name == "Medical / Substance abuse") {
        return '#FFCC32'
      } else if (d.name == "Medical / Psych") {
        return '#846A6A'
      } else if (d.name == "Psych / Substance abuse") {
        return '#996B7D'
      } else if (d.name == "Tri-morbidity") {
        return '#DE8067'
      } else {
        return 'white'//'#493843'
      }
    })
    .on("mouseover", function(d) {
        tooltipAll.classList.add("show");
        if (d.percent){
          tooltipAll.innerHTML = `
            <div>Illness: ${d.name}</div>
            <div>Percent: ${d.percent}</div>
          `;
        } else {
          tooltipAll.classList.remove("show");
        }
    })
    .on("mouseout", function(){
      tooltipAll.classList.remove("show");
    });

svgAll.selectAll("text")
    .data(pack.nodes)
  .enter().append("svg:text")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.percent; });

// get tooltip to move with cursor
document.querySelector(".bubbles-all").addEventListener("mousemove", function(e) {
  var bounds = this.getBoundingClientRect();
  var x = e.clientX - bounds.left;
  var y = e.clientY - bounds.top;
  tooltipAll.style.left = x + 10 + "px";
  tooltipAll.style.top = y + 200 + "px";
  tooltipAll.classList[x > bounds.width / 2 ? "add" : "remove"]("flip");
});

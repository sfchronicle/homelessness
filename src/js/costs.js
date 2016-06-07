var d3 = require('d3');

var bar_spacing = 0.2;
var margin = {
  top: 15,
  right: 15,
  bottom: 25,
  left: 200
};

// stacked bar graph ----------------------------------------------------------

var width = 600;
var height = 150;

// x-axis scale
var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], bar_spacing);

// y-axis scale
var x = d3.scale.linear()
    .rangeRound([0, width]);

// color bands
var color = d3.scale.ordinal()
    .range(["#DE8067", "#FFCC32", "#667A96"]);

// use x-axis scale to set x-axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format(".2s"));

// use y-axis scale to set y-axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    // .tickFormat(d3.format("s"));

// create SVG container for chart components
var svg = d3.select(".stacked-bar-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// convert strings to numbers
costsData.forEach(function(d) {
  console.log(d);
  d.group = d["group"];
  d.medical = +d.medical;
  d.mental = +d.mental;
  d.sa = +d.sa;
})

console.log(costsData);

// map columns to colors
color.domain(d3.keys(costsData[0]).filter(function (key) {
    // console.log(key);
    return key !== "group";
}));

costsData.forEach(function (d) {
    var y0 = 0;
    d.types = color.domain().map(function (name) {
        return {
            name: name,
            y0: y0,
            y1: y0 += +d[name]
        };
    });
    d.total = d.types[d.types.length - 1].y1;
});

// x domain is set of years
y.domain(costsData.map(function (d) {
    return d.group;
}));

// svg.append("text")
//     .attr("class", "y label")
//     .attr("text-anchor", "end")
//     .attr("y", 6)
//     .attr("dy", -45)
//     .attr("x", -(height)/2)
//     .attr("transform", "rotate(-90)")
//     .text("Yearly Salary");

// y domain is scaled by highest total
x.domain([0, d3.max(costsData, function (d) {
    return d.total;
})]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// generate rectangles for all the data values
var group = svg.selectAll(".group")
    .data(costsData)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function (d) {
      console.log(d.name);
      console.log(y(d.group));
      return "translate(0," + y(d.group) + ")";
    });

group.selectAll("rect")
    .data(function (d) {
        return d.types;
    })
    .enter().append("rect")
    .attr("height", y.rangeBand())
    .attr("x", function (d) {
        return x(d.y0);
    })
    .attr("width", function (d) {
        return x(d.y1) - x(d.y0);
    })
    .style("fill", function (d) {
        return color(d.name);
    });

//
// // bubble graph ----------------------------------------------------------------
//
//
// if (screen.width > 768) {
//   var diameter = 500,
//       dropdown = document.querySelector("select");
//   var margin = {
//     right: 15,
//     left: 15
//   }
//   var topbuffer = 20;
// } else if (screen.width <= 768 && screen.width > 480) {
//   var diameter = 500,
//       dropdown = document.querySelector("select");
//   var margin = {
//     right: 15,
//     left: 15
//   }
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
// var width = diameter-margin.left-margin.right;
// var height = diameter-topbuffer; //because the bubbles aren't arranged so they're square
//
// var svg = d3.select(".bubbles").append('svg')
//   .attr('width', width + margin.left + margin.right)
//   .attr('height', height)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + 0 + ")"); // giving the bubbles some padding, so that the text won't get cut off on the right and left margins
//
// var bubble = d3.layout.pack()
//     //.sort(null)
//     .sort(function(a, b) {
//       return -(a.value - b.value);
//     }) // sorting from biggest to smallest
//     .size([width, height])
//     // .padding(2)
//     .value(d => d.number);
//
// // show tooltip
// var tooltip = document.querySelector(".tooltip");
// var looping = true;
//
// var showTooltip = function(d, target) {
//   if (!looping) {
//     svg.selectAll('.node').selectAll("circle")
//
//       .style("fill", function(d) {
// 				if (d.group == "all homeless") {
// 					return '#996B7D'
// 				} else if (d.group == "long-term homeless") {
// 					return '#667A96'
// 				} else if (d.group == "top 1% homeless") {
// 					return '#889C6B'
// 				} else if (d.group == "top 2-5% homeless") {
// 					return '#80A9D0'
// 				} else if (d.group == "elderly homeless") {
// 					return '#EB8F6A'
// 				} else if (d.group == "homeless women") {
// 					return '#FFCC32'
// 				}
//       } )
//     d3.select(target.querySelector("circle")) //darker colors on hover
//         .style("fill", function(d) {
//           if (d.group == "all homeless") {
//   					return '#996B7D'
//   				} else if (d.group == "long-term homeless") {
//   					return '#667A96'
//   				} else if (d.group == "top 1% homeless") {
//   					return '#889C6B'
//   				} else if (d.group == "top 2-5% homeless") {
//   					return '#80A9D0'
//   				} else if (d.group == "elderly homeless") {
//   					return '#EB8F6A'
//   				} else if (d.group == "homeless women") {
//   					return '#FFCC32'
//   				}
//       })
//
//     // tooltip info
//     tooltip.classList.add("show");
//     tooltip.innerHTML = `
//       <div>${d.cost}</div>
//       <div>Percent: ${d.number}</div>
//     `;
//   }
// }
//
// var hideTooltip = function(d, target) {
//   if (!looping) {
//     svg.selectAll('.node').selectAll("circle")
//       .style("fill", function(d) {
//         if (d.group == "all homeless") {
// 					return '#996B7D'
// 				} else if (d.group == "long-term homeless") {
// 					return '#667A96'
// 				} else if (d.group == "top 1% homeless") {
// 					return '#889C6B'
// 				} else if (d.group == "top 2-5% homeless") {
// 					return '#80A9D0'
// 				} else if (d.group == "elderly homeless") {
// 					return '#EB8F6A'
// 				} else if (d.group == "homeless women") {
// 					return '#FFCC32'
// 				}
//       })
//     tooltip.classList.remove("show");
//   }
// }
//
// // draw bubbles
// var drawBubbles = function(selectedCost) {
//
//   // transition time
//   var duration = 1000;
//
//   // look at data for a specific year
//   var costGroup = costsData.filter(function(d) { return d.cost == selectedCost });
//
//   // adding the nodes to the chart (automatically generate attributes)
//   var nodes = bubble.nodes({children: costGroup})
//     .filter(d => !d.children); // filter out the outer bubble
//
//   var node = svg.selectAll('.node')
//     .data(nodes, d => d.group);
//
//   // initializing the bubbles
//   var entering = node.enter()
//     .append('g')
//     .attr('transform', d => `translate(${d.x}, ${d.y})`)
//     .attr('class', 'node')
//     .on("mouseenter", function(d) {
//       showTooltip(d, this);
//     })
//     .on("mouseleave", function(d) {
//       hideTooltip(d, this);
//       tooltip.classList.remove("show");
//     });
//
//   // bubble attributes on rendering
//   entering.append("circle")
//     .attr("r", d => 0)
//     .style('opacity', 1)
//     .style("fill", function(d) {
//       if (d.group == "all homeless") {
//         return '#996B7D'
//       } else if (d.group == "long-term homeless") {
//         return '#667A96'
//       } else if (d.group == "top 1% homeless") {
//         return '#889C6B'
//       } else if (d.group == "top 2-5% homeless") {
//         return '#80A9D0'
//       } else if (d.group == "elderly homeless") {
//         return '#EB8F6A'
//       } else if (d.group == "homeless women") {
//         return '#FFCC32'
//       }
//     });
//
//   // text for bubbles
//   entering.append("text")
//     .style("opacity", 0)
//     .attr("dy", ".3em")
//     .style("text-anchor", "middle")
//     .style("fill", "black")
//     .style("font-size", "12px")
//     .text(function(d) {
// 			return d.group;
//       // if (d.Geography && (d.Geography.length*4 < d.r)) {
//       //   return d.Geography.substring(0, d.r);
//       // } else if (d.Geography) {
//       //   return d.Abbreviation;
//       // }
//     });
//     //.text(function(d) { if (d.Geography) { return d.Geography.substring(0, d.r); } });
//
//   // transition for bubble translation
//   var transition = node.transition()
//     .duration(duration)
//     .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
//
//   transition.select("circle").attr("r", d => d.r);
//   transition.select("text").style("opacity", 1);
//
//   var exiting = node.exit()
//     .transition()
//     .duration(duration);
//
//   exiting.select("circle").attr("r", d => 0);
//   exiting.select("text").style("opacity", 0);
//   exiting.remove();
// }
//
// // fills in HTML for year as years toggle
// var updateInfo = function(cost) {
//   document.querySelector(".info").innerHTML = `<strong>${cost}</strong>`;
// };
//
// // if user picks the year, we update the selected mode and stop looping
// dropdown.addEventListener("change", function() {
//   document.querySelector(".start").classList.remove("selected");
//   document.querySelector(".pause").classList.add("selected");
//   looping = false;
//   document.querySelector(".chart").classList.add("clickable");
//   clearTimeout(loop);
//   drawBubbles(costs[dropdown.value]);
//   updateInfo(costs[dropdown.value]);
// });
//
// document.querySelector(".start").addEventListener("click", function(e) {
//   if (looping) { return }
//   document.querySelector(".start").classList.add("selected");
//   document.querySelector(".pause").classList.remove("selected");
//   looping = true;
//   document.querySelector(".chart").classList.remove("clickable");
//   dropdown.value = "--";
//   tick();
// })
// document.querySelector(".pause").addEventListener("click", function(e) {
//   if (!looping) { return }
//   document.querySelector(".start").classList.remove("selected");
//   document.querySelector(".pause").classList.add("selected");
//   looping = false;
//   document.querySelector(".chart").classList.add("clickable");
//   clearTimeout(loop);
// })
//
// // var years = [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];
// //var years = [1997, 2005, 2010, 2014];
// var costs = ["emergency services (total)","emergency services (average)", "medical emergency services (average)","mental health services (average)","substance abuse services (average)"];
// var i = 0;
//
// var loop = null;
// var tick = function() {
//   drawBubbles(costs[i]);
//   updateInfo(costs[i]);
//   i = (i + 1) % costs.length;
//   loop = setTimeout(tick, i == 0 ? 2000 : 1000);
// };
//
// tick();
//
// // get tooltip to move with cursor
// document.querySelector(".bubbles").addEventListener("mousemove", function(e) {
//   var bounds = this.getBoundingClientRect();
//   var x = e.clientX - bounds.left;
//   var y = e.clientY - bounds.top;
//   tooltip.style.left = x + 10 + "px";
//   tooltip.style.top = y + 10 + "px";
//
//   tooltip.classList[x > bounds.width / 2 ? "add" : "remove"]("flip");
// });

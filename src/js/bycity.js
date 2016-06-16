require("component-responsive-frame/child");
var d3 = require('d3');

// setting sizes of interactive features
var bar_spacing = 0.2;
var margin = {
  top: 15,
  right: 15,
  bottom: 80,
  left: 70
};

// colors for bubble graph
var colors = {
  'CA': '#D13D59',
  'WA': '#996B7D',
  'TX': '#A89170',
  'IL': '#61988E',
  'FL': '#6E7B8E',
  'CO': '#80A9D0',
  'PA': '#FFE599',
  'HI': '#FFCC32',
  'OH': '#99B4CF',
  'MN': '#99B4CF',
  'UT': '#E89EAC',
  'MA': '#9FA7B3',
  'ME': '#E59FA6',
  'AK': '#61988E',
  'GA': '#846A6A',
  'OR': '#EB8F6A',
  'LA': '#6F7D8C',
  'AZ': '#DE8067',
  'NV': '#667A96',
  'NC': '#FFE599',
  'MO': '#9C8B9E',
  'WI': '#D04B61',
  'IA': '#996B7D',
  'NM': '#DE8067',
  'OK': '#493843',
  'MD': '#80A9D0',
  'DC': '#DE8067',
  'TN': '#FFE599',
  'MI': '#6C85A5',
  'KY': '#D04B61',
  'NJ': '#889C6B',
  'IN': '#E6A8A8',
  'fallback': 'blue'
};

// bubble graph ---------------------------------------------------------------

if (screen.width > 768) {
  var width = 900 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;
} else if (screen.width <= 768 && screen.width > 480) {
  var width = 650 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
} else if (screen.width <= 480) {
  var margin = {
    top: 15,
    right: 15,
    bottom: 40,
    left: 45
  };
  var width = 310 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
}

// convert strings to numbers
pitData.forEach(function(d) {
  d.coc = d.coc_name;
  d.state = d.coc_number.substring(0,2);
  d.total_homeless = +d.total_homeless;
  d.population = +d.population;
  d.unsheltered = +d.unsheltered_homeless;
  d.homeless_norm = +d.homeless_per_100000;
  d.unsheltered_norm = d.unsheltered_homeless_per_100000;
  d.percent = Math.round(d.total_homeless/d.population*10000)/100;
})

// x-axis scale
var x = d3.scale.linear()
    .rangeRound([0, width]);

// y-axis scale
var y = d3.scale.linear()
    .rangeRound([height, 0]);

// color bands
// var color = d3.scale.ordinal()
//     .range(["#FFE599", "#DE8067"]);

// var color = d3.scale.category10();
// var color = "red";

// use x-axis scale to set x-axis
if(screen.width <= 480) {
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) {
        if ((d/100000 & 1) == 1) {
          return '';
        } else {
          return d/1e6 + "M";
        }
      });

} else {
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.format(".2s"));
}

// use y-axis scale to set y-axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(function(d) {
      return d/1e3 + "K";
    })//d3.format(".2s"));

// create SVG container for chart components
var svg = d3.select(".city-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(pitData, function(d) { return d.population; })).nice();//.nice();
y.domain(d3.extent(pitData, function(d) { return d.total_homeless; })).nice(); //.nice();

if (screen.width <= 480) {
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 35)
      .style("text-anchor", "end")
      .text("County population");
} else {
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("County population");
}

if (screen.width <= 480) {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .style("fill","white")
      .text("County homeless population")
} else {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .style("fill","white")
      .text("County homeless population")
}


//color in the dots
svg.selectAll(".dot")
    .data(pitData)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("id", function(d) {
      return d.coc.replace(/\s/g, '').toLowerCase();
    })
    .attr("class", function(d) {
      return "dot "+d.coc.replace(/\s/g, '').toLowerCase();
    })
    .attr("r", function(d) {
      // return 6;
      if (screen.width <= 480) {
        return (d.unsheltered_norm/70)+5;
      } else {
        return (d.unsheltered_norm/30+6);
      }
    })
    .attr("cx", function(d) { return x(d.population); })
    .attr("cy", function(d) { return y(d.total_homeless); })
    .style("opacity",0.9)
    .style("fill", function(d) {
      return color_function(d.state) || colors.fallback;
    })
    .on("mouseover", function(d) {
        tooltip_cities.html(`
            <div>County/city: <b>${d.coc}</b></div>
            <div>State: <b>${d.state}</b><div class="swatch ${d.state}"></div></div>
            <div>Total homeless population: <b>${d.total_homeless}</b></div>
            <div>Homeless population per 100,000: <b>${d.homeless_norm}</b></div>
            <div>Unsheltered homeless per 100,000: <b>${d.unsheltered_norm}</b></div>
        `);
        tooltip_cities.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return tooltip_cities
          .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
          .style("left",10+"px");
      } else {
        return tooltip_cities
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-80)+"px");
      }
    })
    .on("mouseout", function(){return tooltip_cities.style("visibility", "hidden");});

function color_function(state) {
  if (colors[state]) {
    return colors[state];
  } else {
    return null;
  }
}

var node = svg.selectAll(".circle")
    .data(pitData)
    .enter().append("g")
    .attr("class","node");

// if (screen.width <= 480) {
//   node.append("text")
//       .attr("x", function(d) {
//         if (d.school == "Palo Alto Unified") {
//           return x(d.salaryK)-50
//         } else {
//           return x(d.salaryK)-10
//         }
//       })
//       .attr("y", function(d) { return y(d.rentK)-4; })
//       .attr("id", function(d) {
//         return (d.school.replace(/\s/g, '').toLowerCase()+"text");
//       })
//       .style("fill","BFBFBF")
//       .style("font-size","10px")
//       .style("font-style","italic")
//       .style("visibility",function(d) {
//         if (d.percent > 35 || d.school == "Los Angeles Unified") {
//           return "visible"
//         }
//       })
//       .text(function(d) {
//           return d.school
//       });
// } else {
  node.append("text")
      .attr("x", function(d) {
        if (d.coc == "San Francisco") {
          return x(d.population)+10;
        } else {
          return x(d.population)-20;
        }
      })
      .attr("y", function(d) {
        if ((d.coc == "San Francisco") && (screen.width <= 480)) {
          return y(d.total_homeless);
        } else {
          return y(d.total_homeless)-10;
        }
      })
      .attr("id", function(d) {
        return (d.coc.replace(/\s/g, '').toLowerCase()+"text");
      })
      .attr("class","dottext")
      .style("fill","#262626")
      .style("font-size",function(d) {
        if (d.coc == "San Francisco") {
          if (screen.width > 768) {
            return "25px"
          } else {
            return "20px"
          }
        } else {
          if (screen.width > 768) {
            return "13px"
          } else {
            return "10px"
          }
        }
      })
      .style("font-style","italic")
      .style("visibility",function(d) {
        if (d.percent >= 0.7) {
          if (screen.width > 768){
            return "visible"
          } else {
            if (d.total_homeless>2000) {
              return "visible"
            } else {
              return "hidden"
            }
          }
        } else {
          return "hidden"
        }
      })
      .text(function(d) {
        if ((d.coc == "San Francisco") && (screen.width <= 480)) {
          return "SF"
        } else {
          return d.coc
        }
      });
// }


// show tooltip
var tooltip_cities = d3.select(".city-graph")
    .append("div")
    .attr("class","tooltip_cities")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")

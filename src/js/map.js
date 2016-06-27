var $ = require("jquery");
//var pymChild = new pym.Child();

//load our custom elements
require("component-leaflet-map");
// require("component-responsive-frame");
var d3 = require('d3');

// setting sizes of interactive features
var bar_spacing = 0.2;
var margin = {
  top: 15,
  right: 15,
  bottom: 25,
  left: 40
};

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

// Disable drag and zoom handlers.
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.keyboard.disable();

if (screen.width <= 480) {
  map.setView(new L.LatLng(37.75, -122.43), 11);
} else {
  map.setView(new L.LatLng(37.77, -122.44), 13);
}
map.scrollWheelZoom.disable();

/* Initialize the SVG layer */
map._initPathRoot()

var looping = true;

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
g = svg.append("g");

/* Add a LatLng object to each item in the dataset */
calls311Data.forEach(function(d) {
		d.LatLng = new L.LatLng(d.Lat,
								d.Long)
});

calls911Data.forEach(function(d) {
		d.LatLng = new L.LatLng(d.Lat,
								d.Long)
});

var callsData = calls311Data;
var toggle = "311";

// draw bubbles
var drawMap = function(selected_year,callsData) {

	d3.select("svg").selectAll("circle").remove();
	var svg = d3.select("#map").select("svg"),
	g = svg.append("g");

  // transition time
  var duration = 700;

	if (toggle == "311") {
		var yearData = callsData.filter(function(d) {
			return d.Year == selected_year
		});
	} else {
		var yearData = callsData.filter(function(d) {
			return d.TIME_PERIOD == selected_year
		});
	}


  if (screen.width <= 480) {
  	var feature = g.selectAll("circle")
  		.data(yearData)
  		.enter().append("circle")
  		// .style("stroke", "black")
  		.style("opacity", .5)
  		.style("fill", function(d) {
  			if (d.CALL_TYPE == "915") {
  				return "#C4304C"//"#EB5773"//'#E59FA6'//"#EB5773"//"#D13D59"
  			} else if (d.CALL_TYPE == "919") {
  				return '#FFCC32'//'#FFE599'//'#6E7B8E'//"#869FBF"//"#6C85A5"
  			} else {
  				return "#C45187"//"#AD537D"//"#FF4F4F"//"#80A9D0"//"#DE8067"
  			}
  		})
  		.attr("r", 2);
  } else {
    var feature = g.selectAll("circle")
  		.data(yearData)
  		.enter().append("circle")
  		// .style("stroke", "black")
  		.style("opacity", .5)
  		.style("fill", function(d) {
  			if (d.CALL_TYPE == "915") {
  				return "#C4304C"//"#EB5773"//'#E59FA6'//"#EB5773"//"#D13D59"
  			} else if (d.CALL_TYPE == "919") {
  				return '#FFCC32'//'#FFE599'//'#6E7B8E'//"#869FBF"//"#6C85A5"
  			} else {
  				return "#C45187"//"#AD537D"//"#FF4F4F"//"#80A9D0"//"#DE8067"
  			}
  		})
  		.attr("r", 3.5);
  }

	map.on("viewreset", update);
	update();

	function update() {
		feature.attr("transform",
		function(d) {
			return "translate("+
				map.latLngToLayerPoint(d.LatLng).x +","+
				map.latLngToLayerPoint(d.LatLng).y +")";
			}
		)
	}

}

// fills in HTML for year as years toggle
var updateInfo = function(year) {
	if (toggle == "311") {
  	document.querySelector(".display-year").innerHTML = `<strong>${year}</strong>`;
	} else {
		document.querySelector(".display-year").innerHTML = `<strong>${period_list[year-1]}</strong>`;
	}
};

var years = [2013,2014,2015,2016];
var periods = [1,2,3];
var period_list = ["March 2013 - March 2014","March 2014 - March 2015","March 2015 - March 2016"];
var short_period_list = ["3/13-3/14","3/14-3/15","3/15-3/16"];
var i = 0;

var loop = null;
var tick = function() {
	if (toggle == "311") {
	  drawMap(years[i],callsData);
		updateInfo(years[i]);
	  i = (i + 1) % years.length;
	} else {
		drawMap(periods[i],callsData);
		updateInfo(periods[i]);
	  i = (i + 1) % periods.length;
	}
  loop = setTimeout(tick, i == 0 ? 1700 : 1000);
};

tick();

$("#map311").click(function() {
  pymChild.sendHeight();
	$("#map311").addClass("selected");
	$("#map311-info").addClass("selected");
	$("#map911").removeClass("selected");
	$("#map911-info").removeClass("selected");
	$(".header311").addClass("active");
	$(".header911").removeClass("active");
  callsData = null;
	callsData = calls311Data;
	toggle = "311";
	clearTimeout(loop);
	i = 0;
	tick();
});

$("#map911").click(function() {
  pymChild.sendHeight();
	$("#map311").removeClass("selected");
	$("#map311-info").removeClass("selected");
	$("#map911").addClass("selected");
	$("#map911-info").addClass("selected");
	$(".header311").removeClass("active");
	$(".header911").addClass("active");
  callsData = null;
	callsData = calls911Data;
	toggle = "911";
	looping = false;
	clearTimeout(loop);
	i = 0;
	tick();
});

setTimeout( function(){
    // Do something after 1 second
    document.querySelector(".start").classList.remove("selected");
    document.querySelector(".pause").classList.add("selected");
    looping = false;
    clearTimeout(loop);
  }  , 60000 );

// clustered bar graph ----------------------------------------------------------

barchart();

$("#mapoptions").click ( function() {
	barchart();
  document.querySelector(".start").classList.add("selected");
  document.querySelector(".pause").classList.remove("selected");
  looping = true;
});

document.querySelector(".start").addEventListener("click", function(e) {
  if (looping) { return }
  document.querySelector(".start").classList.add("selected");
  document.querySelector(".pause").classList.remove("selected");
  looping = true;
  tick();
})
document.querySelector(".pause").addEventListener("click", function(e) {
  if (!looping) { return }
  document.querySelector(".start").classList.remove("selected");
  document.querySelector(".pause").classList.add("selected");
  looping = false;
  clearTimeout(loop);
})

function barchart() {
	d3.select("#bar-chart").select("svg").remove();

	if (toggle == "311") {
		var barData = barchart311Data;
	} else if (toggle == "911") {
		var barData = barchart911Data;
	}

	// show tooltip
	var bar_tooltip = d3.select(".bar-chart")
			.append("div")
			.attr("class","bar_tooltip")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")

	var margin = {
		top: 15,
		right: 15,
		bottom: 25,
		left: 55
	};
	if (screen.width > 768) {
		var width = 500 - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom;
	} else if (screen.width <= 768 && screen.width > 480) {
		var width = 460 - margin.left - margin.right;
		var height = 250 - margin.top - margin.bottom;
	} else if (screen.width <= 480) {
		var margin = {
			top: 15,
			right: 15,
			bottom: 25,
			left: 55
		};
		var width = 310 - margin.left - margin.right;
		var height = 220 - margin.top - margin.bottom;
	}

	// x-axis scale
	var x0 = d3.scale.ordinal()
			.rangeRoundBands([0, width], bar_spacing);
	var x1 = d3.scale.ordinal();

	// y-axis scale
	var y = d3.scale.linear()
			.rangeRound([height, 0]);

	// color bands
	if (toggle == "311") {
		var color = d3.scale.ordinal()
				.range(["#B7447A"]);//"#FF4F4F"]);//#FF4F4F"]);
	} else {
		var color = d3.scale.ordinal()
				.range(["#FFFF7F", "#F2BF25", "#EB5773", "#9E0A26", ]);
	}

	// use x-axis scale to set x-axis
  // use x-axis scale to set x-axis
  if ((screen.width <= 480) && (toggle == "911")) {
    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom")
        .tickFormat(function(d) {
          if ((d.slice(-1) & 1) != 0) {
            return '';
          } else {
            return d;
          }
        });
  } else {
    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");
  }

	// use y-axis scale to set y-axis
	var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));

	// create SVG container for chart components
	var svg = d3.select(".bar-chart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// map columns to colors
	var yearMap = d3.keys(barData[0]).filter(function (key) {
			if (key != "types") {
				return key !== "time_period";
			}
	});

  if (toggle == "911") {
    var yBegin;
    var innerColumns = {
      "column1" : ["sit_lie_citations_and_arrests", "dispatched_sit_lie_calls"],
      "column2" : ["homeless_related_citations_and_arrests", "dispatched_homeless_related_police_calls"]
    }

    if (!barData[0].columnDetails) {
      barData.forEach(function (d) {
        var yColumn = new Array();
        d.columnDetails = yearMap.map(function(name) {
          for (var ic in innerColumns) {
            if ($.inArray(name,innerColumns[ic]) >= 0) {
              if (!yColumn[ic]){
                yColumn[ic] = 0;
              }
              yBegin = yColumn[ic];
              yColumn[ic] += +d[name];
              return {
                name: name,
                column: ic,
                yBegin: yBegin,
                yEnd: +d[name]+yBegin,
              }
            }
          }
        });
        d.total = d3.max(d.columnDetails, function(d) {
          if (d) {
            return d.yEnd;
          }
        });
      });
    }

    // x domain is set of years
    x0.domain(barData.map(function (d) {
        return d.time_period;
    }));

    x1.domain(d3.keys(innerColumns)).rangeRoundBands([0, x0.rangeBand()]);

    y.domain([0, d3.max(barData, function(d) {
     return d.total;
   })]);

  } else {

  	if (!barData[0].types) {
  		barData.forEach(function (d) {
  				var y0 = 0;
  				d.types = yearMap.map(function (name) {
  						return {
  								name: name,
  								value: +d[name]
  						};
  				});
  		});
  	};

    // x domain is set of years
    x0.domain(barData.map(function (d) {
        return d.time_period;
    }));

    // x domain number 2
    x1.domain(yearMap).rangeRoundBands([0,x0.rangeBand()]);

    // y domain is scaled by highest total
    y.domain([0, d3.max(barData, function (d) {
        return d3.max(d.types, function(d) {
          return d.value;
        });
    })]);

  }

	if (toggle == "311") {
    if (screen.width <= 480) {
  		svg.append("text")
  				.attr("class", "y label")
  				.attr("text-anchor", "end")
  				.attr("y", 2)
  				.attr("dy", -45)
  				.attr("x", -5)
  				.attr("transform", "rotate(-90)")
  				.text("Proportion per 1000 calls");
      } else {
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 2)
            .attr("dy", -45)
            .attr("x", -(height)/3)
            .attr("transform", "rotate(-90)")
            .text("Proportion per 1000 calls");
      }
	} else {
		svg.append("text")
				.attr("class", "y label")
				.attr("text-anchor", "end")
				.attr("y", 2)
				.attr("dy", -45)
				.attr("x", -(height)/3)
				.attr("transform", "rotate(-90)")
				.text("Count");
	}

	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

	svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

  // generate rectangles for all the data values
	var year = svg.selectAll(".year")
			.data(barData)
			.enter().append("g")
			.attr("class", "g")
			.attr("transform", function (d) {
				return "translate(" + x0(d.time_period) + ",0)";
			})
			// .on("mouseover", function(d) {
			// 		bar_tooltip.html(`
			// 				<div>Year: <b>${d.year}</b></div>
			// 				<div>Average teachers salary: <b>$${d.adj_teacher}</b></div>
			// 				<div>Mid-career teacher salary: <b>$${d.adj_step_10}</b></div>
			// 				<div>Median household income: <b>$${d.adj_median}</b></div>
			// 		`);
			// 		bar_tooltip.style("visibility", "visible");
			// })
			// .on("mousemove", function() {
			// 	if (screen.width <= 480) {
			// 		return bar_tooltip
			// 			.style("top", (d3.event.pageY+20)+"px")
			// 			.style("left",10+"px");
			// 	} else {
			// 		return bar_tooltip
			// 			.style("top", (d3.event.pageY+20)+"px")
			// 			.style("left",(d3.event.pageX-80)+"px");
			// 	}
			// })
			// .on("mouseout", function(){return bar_tooltip.style("visibility", "hidden");});


  if (toggle == "911") {

   year.selectAll("rect")
       .data(function(d) {
         return d.columnDetails;
       })
     .enter().append("rect")
       .attr("width", x1.rangeBand())
       .attr("x", function(d) {
         return x1(d.column);
          })
       .attr("y", function(d) {
         return y(d.yEnd);
       })
       .attr("height", function(d) {
         return y(d.yBegin) - y(d.yEnd);
       })
       .style("fill", function(d) {
         return color(d.name);
       });

  } else {

  	year.selectAll("rect")
  			.data(function (d) {
  				return d.types;
  			})
  			.enter().append("rect")
  			.attr("width", x1.rangeBand())
  			.attr("x", function (d) {
  				return x1(d.name);
  			})
  			.attr("y", function (d) {
  				return y(d.value);
  			})
  			.attr("height", function (d) {
  				return height - y(d.value);
  			})
  			.style("fill", function (d) {
  				return color(d.name);
  			});

  	};
  }

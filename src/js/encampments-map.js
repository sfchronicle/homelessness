
// load our custom elements
require("component-leaflet-map");
var d3 = require('d3');

// color code
var red = "#EB5773";
var yellow = "#f9ac06";
var blue = "#3068e0"

// get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;


// Disable drag and zoom handlers.
// map.dragging.disable();
map.touchZoom.disable();
// map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.keyboard.disable();

if (screen.width <= 480) {
  map.setView(new L.LatLng(37.75, -122.43), 11);
} else {
  map.setView(new L.LatLng(37.77, -122.44), 13);
}

/* Initialize the SVG layer */
L.svg().addTo(map);



/* Add a LatLng object to each item in the dataset */
allMapData.forEach(function(d) {
		d.LatLng = new L.LatLng(d.Latitude,
								d.Longitude);
		
});


var svgMap = d3.select("#complaints-map").select("svg");
var g = svgMap.append("g");

// default view upon initial load, 2011 data
var feature = g.selectAll("circle")
	.data(allMapData.filter(function (d) {
	  	return (d.YearOpened == 2011);
	}))
  	.enter().append("circle")
  	.attr("class", function (d) {
  		return d.RequestID;
  	})
  	.style("opacity", 0.4)
  	.style("fill", function (d) {
  		if (d.RequestID == "encampment") {
  			return red;
  		} else if (d.RequestID == "waste") {
  			return yellow;
  		} else {
  			return blue;
  		}
  	})
  	.attr("r", 2)
  	.attr("transform", function(d) {
    	return "translate("+
          	(map.latLngToLayerPoint(d.LatLng).x) +","+
          	map.latLngToLayerPoint(d.LatLng).y +")";
    });



function drawComplaints(complaintsData, year) {

	// clear prev year's data
	g.selectAll("circle").remove();

	var feature = g.selectAll("circle")
	  	.data(complaintsData.filter(function (d) {
	  		//console.log(d.YearOpened);
	  		if (year != "all") {
	  			return d.YearOpened == year;
	  		} else {
	  			return d;
	  		}
	  	}))
  		.enter().append("circle")
  		.attr("class", function (d) {
  			return d.RequestID;
  		})
  		.style("opacity", 0.4)
  		.style("fill", function (d) {
  			if (d.RequestID == "encampment") {
  				return red;
  			} else if (d.RequestID == "waste") {
  				return yellow;
  			} else {
  				return blue;
  			}
  	})
  		.attr("r", 2)
  		.attr("transform", function(d) {
        		return "translate("+
          		(map.latLngToLayerPoint(d.LatLng).x) +","+
          		map.latLngToLayerPoint(d.LatLng).y +")";
        	});

  	checkForToggle();
}

    function checkForToggle () {
      var toggles = document.querySelectorAll('.toggle');
      // console.log(toggles);
      for (var i = 0; i < toggles.length; i++) {
        var pointClass = '.'+toggles[i].id;
        // console.log(pointClass);

        if (toggles[i].checked) {
          // console.log(toggles[i]);
          d3.selectAll(pointClass).attr('visibility', 'visible');
        } else {
          d3.selectAll(pointClass).attr('visibility', 'hidden');

        }
      }
    };

  // 	function redrawSubset(subset) {
  //   	path.pointRadius(2);// * scale);

  //   	if (App.dataView !== 'all') {
  //     		subset = subset.filter(function (d) {
  //       		return new Date( d.properties.date ).getFullYear() === parseInt( App.dataView );
  //     		});
  //   	}


  
  //   	var points = g.selectAll('path')
  //                 .data(subset, function (d) {
  //                     return d.id;
  //                 });
  //   points.enter().append('path');
  //   points.exit().remove();
  //   points.attr('d', path);
  //   points.attr('class', function(d) { return d.properties.kind; });

  //   points.style('fill-opacity', function (d) {
  //     if (d.group) {
  //       return (d.group * 0.1) + 0.2;
  //     }
  //   });


  //   console.log('updated at  ' + new Date().setTime(new Date().getTime() - start.getTime()) + ' ms ');

  //   checkForToggle();

  // }


function handleChange (e) {
    var option   = e.target.options[e.target.selectedIndex];
    drawComplaints(allMapData, option.value);

}


var yearSelect = document.querySelector('select');
yearSelect.addEventListener('change', handleChange, false);



function handleCommand (e) {
    var pointClass = '.'+e.target.id;
    if (e.target.checked) {
      // console.log(pointClass);
      d3.selectAll(pointClass).attr('visibility', 'visible');
    } else {
      d3.selectAll(pointClass).attr('visibility', 'hidden');
    }
    checkForToggle();
}

var nodes = document.querySelectorAll('.toggle');
for (var i = 0; i < nodes.length; i++) {
  	// console.log(i);
  nodes[i].addEventListener('click', handleCommand, false);
}



// map.on("viewreset", update);
// update();

// function update() {
// 	feature.attr("transform",
// 	function(d) {
// 		return "translate("+
// 			map.latLngToLayerPoint(d.LatLng).x +","+
// 			map.latLngToLayerPoint(d.LatLng).y +")";
// 		}
// 	)
// }

// show tooltip
// var tooltip = d3.select("div.tooltip-srosmap");

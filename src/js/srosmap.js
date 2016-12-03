//load our custom elements
require("component-leaflet-map");
var d3 = require('d3');

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

function tooltip_function (d) {
  if (d.NAME != "NA") {
    var html_str = "<div class='name'><span class='bold'>Property: </span>"+d.NAME+"</div><div class='violations'><span class='bold'>Number of violations: </span>"+d.DBI_VIOLATIONS+"</div>"
  } else {
    var html_str = "<div class='name'><span class='bold'>Address: </span>"+d.FULL_ADDRESS+"</div><div class='violations'><span class='bold'>Number of violations: </span>"+d.DBI_VIOLATIONS+"</div>"
  }
  return html_str;
}

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

/* We simply pick up the SVG from the map object */

/* Add a LatLng object to each item in the dataset */
srosMapData.forEach(function(d) {
		d.LatLng = new L.LatLng(d.Lat,
								d.Long)
});

// var srosDataShort = srosMapData;

var svgMap = d3.select("#sros-map").select("svg"),
g = svgMap.append("g");

var feature = g.selectAll("dot")
  .data(srosMapData)
  .enter().append("circle")
  // .style("stroke", "black")
  .style("opacity", function(d) {
    if (d.SuppHsg == "Yes") {
      if (screen.width <=480) {
        return 1
      } else {
        return 0.8;
      }
    } else {
      return 0.6
    }
  })
  .style("fill", function(d) {
    if (d.SuppHsg == "Yes") {
      return "#C4304C"
    } else {
      return "#6C85A5"
    }
    // return "#C4304C"//"#EB5773"//'#E59FA6'//"#EB5773"//"#D13D59"
  })
  .attr("r", function(d) {
    if (screen.width <= 480) {
      return (d.DBI_VIOLATIONS/20+0.5);
    } else {
      return (d.DBI_VIOLATIONS/10+1);
    }
  })
  .on('mouseover', function(d,flag) {
    var html_str = tooltip_function(d);
    // var html_str = "this is a string"
    tooltip.html(html_str);
    tooltip.style("visibility", "visible");
  })
  .on("mousemove", function() {
    if (screen.width <= 480) {
      return tooltip
        .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
        .style("left",10+"px");
    } else {
      return tooltip
        .style("top", (d3.event.pageY+16)+"px")
        .style("left",(d3.event.pageX-50)+"px");
    }
  })
  .on("mouseout", function(){
    // if (screen.width <= 480) {
    //   return federal_tooltip.transition().delay(20).style("visibility", "hidden");
    // } else {
      return tooltip.style("visibility", "hidden");
    // }
  });

if (screen.width <= 480) {

  var node = svgMap.selectAll(".circle")
      .data(srosMapData)
      .enter().append("g")
      .attr("class","node");

  node.append("text")
      .style("fill","black")
      .style("font-family","AntennaExtraLight")
      .style("font-size","14px")
      .style("font-style","italic")
      .style("visibility",function(d) {
        if (d.NAME == "Crosby Hotel") {
          return "visible"
        } else {
          return "hidden"
        }
      })
      .attr("transform",
      function(d) {
        return "translate("+
          (map.latLngToLayerPoint(d.LatLng).x+10) +","+
          map.latLngToLayerPoint(d.LatLng).y +")";
        }
      )
      .text(function(d) {
        return d.NAME
      });
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

// show tooltip
var tooltip = d3.select("div.tooltip-srosmap");

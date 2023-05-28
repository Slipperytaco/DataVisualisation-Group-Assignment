var regions;
var years = d3.range(2004, 2021);
var colorScale;
var geojson;
var color;
function init(){

    var w = 600;
    var h = 550;

    var svg = d3.select("#heatMap")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var projection = d3.geoMercator()
        .center([134.48978, -25.27816]) // long, lat values of Australia's center 
        .translate([w / 2, h / 2])
        .scale(650); 

    var path = d3.geoPath().projection(projection);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // Load and display the GeoJSON
    d3.json("resources/australia-with-states_782.geojson")
        .then(function(data) {
            geojson = data;
            svg.selectAll("path")
                .data(geojson.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("stroke", "black")
                .attr("fill", "lightgrey");
    });

    //NOMARRIVAL DATASET - will change names once slider working 
    d3.csv("resources/heatMapDataNew.csv")
        .then(function(csvData) {
            regions = csvData.columns.slice(1); // first column is yr so skip it 

            data = csvData.map(function(d) {
                var o = {year: +d.Year}; //converts string to num
                regions.forEach(function(r) { o[r] = +d[r].replace(/,/g, ""); }); //converts string to number
                return o;
            });
                //color scale
            var maxVal = d3.max(data, function(d) { return d3.max(regions, function(r) { return d[r]; }); });
            color = d3.scaleQuantize()
                    .domain([0, maxVal])
                    .range(d3.schemeReds[9]); 
                    
            // Create a separate SVG for the legend
            var legendSvg = d3.select("#legend").append("svg")
                .attr("width", 800)
                .attr("height", 100);

                // Draw one rectangle for each color in the scale
            var legend = legendSvg.selectAll(".legend")
                .data(color.range())
                .enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) { return 30 * i; })
                .attr("width", 50)
                .attr("height", 30)
                .style("fill", function(d) { return d; });

                // Add text labels for the color values
            legend.append("text")
                .attr("x", function(d, i) { return 30 * i; })
                .attr("y", 50)
                .attr("transform", function(d, i) { return "rotate(-65," + (30 * i) + ",50)"; })
                .style("text-anchor", "end")
                .text(function(d, i) { return Math.round(color.invertExtent(d)[0]); });
            
            
    }); 
    
    var sliderDiv = d3.select("#slider");
    
    var slider = sliderDiv.append("input")
        .attr("type", "range")
        .attr("min", 2004)
        .attr("max", 2021)
        .attr("value", 2004)
        .on("input", function() {
            update(+this.value); //calls update function when slider changes 
    });
    svg.append("text")
        .attr("id", "title")
        .attr("x", w / 2)             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px")   
        .text("Net Overseas Arrivals - Year " + slider.value);
 
        function update(year) {
            // Convert the year data into the old format
            var yearData = data.find(d => d.year === year);
            var convertedYearData = regions.map(function(region) {
                return {region: region, value: yearData[region]};
            });
        
            // Join this data with the GeoJSON data
            svg.selectAll("path")
                .data(geojson.features)
                .join(
                    enter => enter.append("path").attr("d", path).attr("stroke", "black"),
                    update => update
                )
                .attr("fill", function(d) {
                    // Find the data value for this feature
                    var row = convertedYearData.find(row => row.region === d.properties.STATE_NAME);
                    if (!row) {
                        console.log("No match found for: " + d.properties.STATE_NAME);
                        return "lightgrey" //default color
                    }
                    return color(row.value);
                })
                .on("mouseover", function(d) {      
                    var row = convertedYearData.find(row => row.region === d.properties.STATE_NAME); // <--- Moved this line inside the mouseover function
                    if(row) {
                        tooltip.transition()        
                            .duration(200)      
                            .style("opacity", .9);      
                        tooltip.html("State: " + d.properties.STATE_NAME + "<br/>Value: " + row.value)  
                            .style("left", (d3.event.pageX) + "px")     
                            .style("top", (d3.event.pageY - 28) + "px");  
                    }  
                })                
                .on("mouseout", function(d) {       
                    tooltip.transition()        
                        .duration(500)      
                        .style("opacity", 0);   
                });
            d3.select("#title").text("Net Overseas Arrivals - Year " + year);

        };
        
};
window.onload = init;

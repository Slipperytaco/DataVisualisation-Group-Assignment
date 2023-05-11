var years = d3.range(2004, 2021);
var colorScale;
var geojson;

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
        .scale(500); 

    var path = d3.geoPath().projection(projection);

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
    d3.csv("resources/netOverseasArrivalsByRegionCalendarYears2004On.csv")
        .then(function(csvData) {
            //data from abs is currently formatted in long format, which essentially means each column is a data point in this case a year
            //d3 needs data to be formatted in wide format, which is when each rown represents a data point, years. 
            //converts to long format 
            data = csvData.map(function(d) {
                var o = {region: d.Region}; //this assumes that value is exactly 'Year' in the csv file
                years.forEach(function(y) { o[y] = +d[y].replace(/,/g, ''); }); //converts string to number
                return o;
            });
                //color scale
            var maxVal = d3.max(data, function(d) { return d3.max(years, function(y) { return d[y]; }); });
            color = d3.scaleQuantize()
                    .domain([0, maxVal])
                    .range(d3.schemeBlues[9]); 
            
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
    

    function update(year){
            // Filter the data for the selected year and convert the numbers to integers
        var yearData = data.map(function(row) {
                return {region: row.region.replace("·  ", "").replace(/ /g,"_"), value:row[year]};
            });
        
            // Join this data with the GeoJSON data
            svg.selectAll("path")
                .data(geojson.features)
                .join(
                    enter => enter.append("path").attr("d", path). attr("stroke", "black"),
                    update => update
                )
                .attr("fill", function(d) {
                    // Find the data value for this feature
                    var row = yearData.find(function(row) {
                        return row.region === d.properties.STATE_NAME;
                    });
                    if (!row) {
                        console.log("No match found for: " + d.properties.STATE_NAME);
                        return "lightgrey" //default color
                    }
        
                    // Return a color based on this value
                    return color(row.value);
                });
        

    };



};
window.onload = init;

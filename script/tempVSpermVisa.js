function initBarChart() {
    d3.csv("resources/netMigrationCalendarYear2004-2019.csv").then(function(data) {
      // Convert string values to numbers
      data.forEach(function(d) {
        d.NOMArrival = +d.NOMArrival;
        d.NOMDeparture = +d.NOMDeparture;
      });
  
      // Filter the data for temporary and permanent visas
      var temporaryVisas = data.filter(function(d) {
        return d.VisaType === "Temporary visas";
      });
  
      var permanentVisas = data.filter(function(d) {
        return d.VisaType === "Permanent visas";
      });
  
      // Dimensions
      var margin = { top: 60, right: 30, bottom: 60, left: 60 };
      var width = 1000 - margin.left - margin.right;
      var height = 400 - margin.top - margin.bottom;
  
      // SVG container for bar chart
      var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      // X scale for years
      var x = d3
        .scaleBand()
        .range([0, width])
        .padding(0.2)
        .domain(temporaryVisas.map(function(d) {
          return d.Year;
        }));
  
      // Y scale for number of arrivals
      var y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(temporaryVisas, function(d) {
          return d.NOMArrival;
        })]);

        var yPermanent = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(permanentVisas, function(d) {
            return d.NOMArrival;
        })]);
  
      // Color scale for year
      var color = d3.scaleOrdinal(d3.schemeCategory10);
  
      // Create the bars for temporary visas
      svg.selectAll(".bar-temporary")
        .data(temporaryVisas)
        .enter()
        .append("rect")
        .attr("class", "bar-temporary")
        .attr("x", function(d) { return x(d.Year); })
        .attr("y", function(d) { return y(d.NOMArrival); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.NOMArrival); })
        .style("fill", function(d) { return color(d.Year); });
  
      // Create the bars for permanent visas
      svg.selectAll(".bar-permanent")
        .data(permanentVisas)
        .enter()
        .append("rect")
        .attr("class", "bar-permanent")
        .attr("x", function(d) { return x(d.Year); })
        .attr("y", function(d) { return yPermanent(d.NOMArrival); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - yPermanent(d.NOMArrival); })
        .style("fill", function(d) { return color(d.Year); });
  
      // Add X-axis to bar chart
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
      // Add Y-axis to bar chart
      svg.append("g")
        .call(d3.axisLeft(y));
            
        // Legend
        var legend = svg.selectAll(".legend")
        .data(temporaryVisas)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
        return "translate(30," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d.Year); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.Year; });

    // Title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Total Temporary Visa vs Permanent Visa Trends from 2004-2019 in Australia");
    });
}

window.onload = initBarChart;
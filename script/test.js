function initBarChart() {
    d3.csv("resources/tempVSperm.csv").then(function(data) {
      // Convert string to number
      data.forEach(function(d) {
        d.Total = +d.Total;
      });
  
     // Group data by VisaType
     var groupedData = d3.nest()
     .key(function(d) { return d.VisaType; })
     .entries(data);
  
      // Dimensions
      var margin = { top: 50, right: 50, bottom: 50, left: 50 };
      var width = 600 - margin.left - margin.right;
      var height = 400 - margin.top - margin.bottom;
  
      // SVG container
      var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      // Scales
      var xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(function(d) { return d.Year; }));
  
      var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d.Total; })]);
  
      // Create bars for temporary visas
      // Update the bars for temporary visas
      svg.selectAll(".bar-temp")
        .data(groupedData.find(function(d) { return d.key === "Temporary visas"; }).values)
        .transition()
        .duration(500)
        .attr("y", function(d) { return yScale(d.Total); })
        .attr("height", function(d) { return height - yScale(d.Total); });

      // Update the bars for permanent visas
      svg.selectAll(".bar-perm")
        .data(groupedData.find(function(d) { return d.key === "Permanent visas"; }).values)
        .transition()
        .duration(500)
        .attr("y", function(d) { return yScale(d.Total); })
        .attr("height", function(d) { return height - yScale(d.Total); });
  
      // Add X-axis to the bar chart
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
  
      // Add Y-axis to the bar chart
      svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));
        
        // Legend
        var legend = svg.selectAll(".legend")
            .data(groupedData.find(function(d) { return d.key === "Temporary visas"; }).values)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
        });
        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "steelblue");

        legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("Temporary Visas");

        // Title
        svg.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Total Temporary Visa vs Permanent Visa Trends from 2004-2019 in Australia");

  });
}

window.onload = initBarChart;
       
  
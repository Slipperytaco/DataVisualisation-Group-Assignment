function movingAverage(data, windowSize) {
  return data.map((row, idx, total) => {
      const start = Math.max(0, idx - windowSize);
      const end = idx;
      const window = total.slice(start, end + 1);
      const avg = window.reduce((sum, row) => sum + row.Total, 0) / window.length;
      return { Year: row.Year, Average: avg };
  });
}
//set vars for trendline 
var showTempTrendLine = false;
var showPermTrendLine = false;


function initTempVsPermBarChart() {
    d3.csv("resources/tempVSperm.csv").then(function(data) {
      // Convert string values to numbers
      data.forEach(function(d) {
        d.Total = +d.Total;
      });
  
      // Filter the data for temporary and permanent visas
      var temporaryVisas = data.filter(function(d) {
        return d.VisaType === "Temporary visas";
      });
      var permanentVisas = data.filter(function(d) {
        return d.VisaType === "Permanent visas";
      });
  
      // container Dimensions
      var margin = { top: 60, right: 100, bottom: 60, left: 60 };
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
      
        //finds max y values of both values, temp and perm returning largest
        var maxValue = Math.max(
            d3.max(temporaryVisas, function(d) { return d.Total; }),
            d3.max(permanentVisas, function(d) { return d.Total; })
        );

      // Y scale, accounts for max value in range
      var y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, maxValue]);
        
        // Color scale for bar types
        var color = d3.scaleOrdinal()
            .domain(["Temporary visas", "Permanent visas"])
            .range(d3.schemeCategory10);
  
      // Create the bars for temporary visas
      svg.selectAll(".bar-temporary")
          .data(temporaryVisas)
          .enter()
          .append("rect")
          .attr("class", "bar-temporary")
          .attr("x", function(d) { return x(d.Year); })
          .attr("y", function(d) { return y(Math.max(0, d.Total)); })
          .attr("width", x.bandwidth() / 2)
          .attr("height", function(d) { return Math.abs(y(d.Total) - y(0)); })
          .style("fill", color("Temporary visas"));
  
      //Create the bars for perm visa
      svg.selectAll(".bar-permanent")
        .data(permanentVisas)
        .enter()
        .append("rect")
        .attr("class", "bar-permanent")
        .attr("x", function(d) { return x(d.Year) + x.bandwidth() / 2; })
        .attr("y", function(d) { return y(d.Total); })
        .attr("width", x.bandwidth() / 2)
        .attr("height", function(d) { return height - y(d.Total); })
        .style("fill", color("Permanent visas"));
        
  
      //x-axis to chart
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .on("click", function(d) {
          displayYearDetails(d);
      
        
      });

      function displayYearDetails(year) {
        d3.csv(`resources/yearDetails/${year}Details.csv`).then(function(data) {

          d3.select("#yearDetails").html("");

          //covert string to numbers
          data.forEach(function(d) {
            d.NOMArrival = +d.NOMArrival;
            d.NOMDeparture = +d.NOMDeparture;
            d.NOM = +d.NOM;
          });

          //console.log(data); - was used to diagnose data processing issues

          var colors = ["#6baed6", "#fd8d3c", "#74c476"];
          var color = d3.scaleOrdinal()
            .domain(["NOMArrival", "NOMDeparture", "NOM"])
            .range(colors);

          var yearData = data;  
          
          //setup the svg for the new chart: 
          var margin = { top: 60, right: 100, bottom: 60, left: 60 };
          var width = 1000 - margin.left - margin.right;
          var height = 400 - margin.top - margin.bottom - margin.bottom;

          var svg = d3
          .select("#yearDetails")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom + margin.bottom) 
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        

          var x0 = d3.scaleBand()
              .rangeRound([0, width])
              .paddingInner(0.1);
          var x1 = d3.scaleBand()
              .padding(0.05);
            var y = d3.scaleLinear()
              .rangeRound([height, 0]);
            
            //define bar groups and colours 
            var keys = ["NOMArrival", "NOMDeparture", "NOM"];

            function abbreviateVisaType(type) {
              if(type.includes("Temporary")) {
                return "Temp";
              } else if(type.includes("Permanent")) {
                return "Perm";
              } else {
                return type;
              }
            }
                    
          // Calculate the minimum and maximum values in the data
          var minValue = d3.min(data, function(d) {
            return Math.min(d.NOMArrival, d.NOMDeparture, d.NOM);
          });
          var maxValue = d3.max(data, function(d) {
            return Math.max(d.NOMArrival, d.NOMDeparture, d.NOM);
          });

          // Define the domain of the y scale based on the data
          var yPositiveMax = d3.max(data, function(d) {
            return Math.max(d.NOMArrival, d.NOMDeparture, d.NOM);
          });
          var yNegativeMin = d3.min(data, function(d) {
            return Math.min(d.NOMArrival, d.NOMDeparture, d.NOM);
          });
        
          // Create the y scales
          var yPositive = d3.scaleLinear()
            .domain([0, yPositiveMax])
            .range([height, 0]);

          var yNegative = d3.scaleLinear()
            .domain([Math.abs(yNegativeMin), 0])
            .range([height, height / 2]);
                    
          var y = d3.scaleLinear()
            .range([height, 0])
            .domain([maxValue, minValue]);
          
            
            x0.domain(yearData.map(function(d) { return abbreviateVisaType(d.MajorGrouping); }));
            x1.domain(keys).rangeRound([0, x0.bandwidth()]);
            
            svg.append("g")
              .selectAll("g")
              .data(yearData)
              .enter()
              .append("g")
              .attr("transform", function(d) { return "translate(" + x0(abbreviateVisaType(d.MajorGrouping)) + ",0)"; })
              .selectAll("rect")
              .data(function(d) { return keys.map(function(key) { return { key: key, value: d[key] }; }); })
              .enter()
              .append("rect")
              .attr("x", function(d) { return x1(d.key); })
              .attr("y", function(d) { return d.value >= 0 ? yPositive(d.value) : yPositive(0); }) 
              .attr("width", x1.bandwidth())
              .attr("height", function(d) { 
                return d.value >= 0 
                  ? yPositive(0) - yPositive(d.value) 
                  : yNegative(0) - yNegative(d.value); 
              })
              .attr("fill", function(d) { return colors[keys.indexOf(d.key)]; });
          
            
            var xAxis = d3.axisBottom(x0);
            var yAxis = d3.axisLeft(y);
    
          // Add the x-axis
          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")") 
            .call(xAxis);
            
          //y pos axis
          svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yPositive)
              .ticks(5)
              .tickFormat(d3.format(".0s")));

          // Add the y-axis for negative values
          svg.append("g")
            .attr("class", "y axis negative-axis")
            .attr("transform", "translate(0," + height / 2 + ")")
            .call(d3.axisLeft(yNegative)
              .ticks(5)
              .tickFormat(d3.format(".0s")));

            // Add legend for visa types
            var legendVisaTypes = svg.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("text-anchor", "end")
              .selectAll("g")
              .data(yearData.map(function(d) { return d.MajorGrouping; }))
              .enter().append("g")
              .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 50) + "," + i * 20 + ")"; });

            var legendBarColors = svg.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("text-anchor", "end")
              .selectAll("g")
              .data(keys.slice())
              .enter().append("g")
              .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 50) + "," + (i * 20 + yearData.length * 20) + ")"; });

            legendBarColors.append("rect")
              .attr("x", 5)
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill", color);

            legendBarColors.append("text")
              .attr("x", 24)
              .attr("y", 9.5)
              .attr("dy", "0.32em")
              .text(function(d) { return d; });

            // Add a horizontal line at y = 0
            svg.append("line")
              .attr("x1", 0)
              .attr("y1", yPositive(0))
              .attr("x2", width)
              .attr("y2", yPositive(0))
              .attr("stroke", "black")
              .attr("stroke-dasharray", "3,3")
              .attr("stroke-width", 2);
          //adds a title to the graph showing the year + details being displayed  
            svg.append("text")
              .attr("class", "graph-title")
              .attr("x", (width + margin.left + margin.right) / 2)
              .attr("y", -30)
              .attr("text-anchor", "middle")
              .text(year + " Details");
            
        });

      }  
  
      //add y axis (1)
      svg.append("g")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(y)
          .tickValues([...d3.ticks(0, maxValue, 8)]));
         
        //legend
      var LegendData = [
        { label: "Temporary visas", color: color("Temporary visas") },
        { label: "Permanent visas", color: color("Permanent visas") },
      ];

      var legend = svg.selectAll(".legend")
        .data(LegendData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(20," + i * 20 + ")";
        });
      //legend rectangles 
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return d.color; });
        
      //legend labels 
      legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.label; });

      //chart title
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Total Temporary Visa vs Permanent Visa Trends from 2004-2019 in Australia");
      
      //TREND LINE / Moving avg implementation: 
      //y scale:
      var y2 = d3.scaleLinear().range([height, 0]).domain([0, maxValue]);

      //create line for trend lines:
      var line = d3.line().x(function(d) { return x(d.Year); }).y(function(d) { return y2(d.Average) });

      //calc moving avg
      var tempMovingAvgs = movingAverage(temporaryVisas, 2); //2 - window size, adjust if need
      var permMovingAvgs = movingAverage(permanentVisas, 2);

      d3.select("#showTempTrend")
        .append("button")
        .text("Toggle Temporary Visa Trend Line")
        .on("click", function() {
            showTempTrendLine = !showTempTrendLine; //toggle function 
            svg.selectAll(".line-temporary").remove();
            svg.selectAll(".axis-right").remove();
            if (showTempTrendLine) {
                svg.append("path")
                    .datum(tempMovingAvgs)
                    .attr("fill", "none")
                    .attr("stroke", color("Temporary visas")) //uses same color scale as bars 
                    .attr("stroke-width", 2)
                    .attr("class", "line-temporary")
                    .attr("d", line);
            }
            if (showTempTrendLine || showPermTrendLine) {
                svg.append("g")
                    .attr("transform", "translate(" + width + ",0)")
                    .attr("class", "axis-right")
                    .call(d3.axisRight(y2));
            }
      });
      d3.select("#showPermTrend")
        .append("button")
        .text("Toggle Permanent Visa Trend Line")
        .on("click", function() {
            showPermTrendLine = !showPermTrendLine;
            svg.selectAll(".line-permanent").remove();
            svg.selectAll(".axis-right").remove();
            if (showPermTrendLine) {
                svg.append("path")
                    .datum(permMovingAvgs)
                    .attr("fill", "none")
                    .attr("stroke", color("Permanent visas"))
                    .attr("stroke-width", 2)
                    .attr("class", "line-permanent")
                    .attr("d", line);
            }
            if (showTempTrendLine || showPermTrendLine) {
                svg.append("g")
                    .attr("transform", "translate(" + width + ",0)")
                    .attr("class", "axis-right")
                    .call(d3.axisRight(y2));
            };
          });  
        
    });
}
window.onload = initTempVsPermBarChart;
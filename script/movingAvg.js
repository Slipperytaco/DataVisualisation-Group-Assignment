function movingAverage(data, windowSize) {
    return data.map((row, idx, total) => {
        const start = Math.max(0, idx - windowSize);
        const end = idx;
        const window = total.slice(start, end + 1);
        const avg = window.reduce((sum, row) => sum + row.Total, 0) / window.length;
        return { Year: row.Year, Average: avg };
    });
}

//implement this code into main function graph to implement moving average trendline. 

/* 
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
            showTempTrendLine = !showTempTrendLine;
            svg.selectAll(".line-temporary").remove();
            svg.selectAll(".axis-right").remove();
            if (showTempTrendLine) {
                svg.append("path")
                    .datum(tempMovingAvgs)
                    .attr("fill", "none")
                    .attr("stroke", color("Temporary visas"))
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
*/

//css code for trendline implementation: 
/*
//makes it dotted 
.line-temporary,
.line-permanent {
  stroke-dasharray: 5, 5;
}

//CSS for trendline for the secondary Y axis 
.axis-right .domain {
  stroke: none;
}
*/
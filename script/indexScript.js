function init(){
    //importing of data from csv
    d3.csv("resources/netMigrationCalendarYear2004-2019.csv").then(function(data) {
        //string to int
        data.forEach(function(d) {
            d["NOM arrival"] = +d["NOM arrival"].replace(/,/g, "");
            d["NOM departure"] = +d["NOM departure"].replace(/,/g, "");
            d.NOM = +d.NOM.replace(/,/g, "");
          });
        //dimensions 
        var margin = {top: 20, right: 20, bottom: 30, left: 60};
        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        //svg container
        var svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //x and y scalees 
        var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(function(d) { return d["Visa type"]; }));

        var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d["NOM arrival"]; })]);

            // Create the bars
        svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d["Visa type"]); })
        .attr("y", function(d) { return y(d["NOM arrival"]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d["NOM arrival"]); });

        // Add x-axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        });

};
window.onload = init
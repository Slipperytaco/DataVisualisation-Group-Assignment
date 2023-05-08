function init(){
    //graph ideas --> line graph of total values (permanent vs temp visa vs aus citizen )
    //bar graph of major grouping values --> NOM value (excluding total values )
    //total value line chart will act as a trend line
    //domain range of years for line graph, domain of visa types excluding total value for bar graph. 
    //these two graphs should be made independently of one another with them being collated at a later date. 

    //importing of data from csv
    d3.csv("resources/netMigrationCalendarYear2004-2019.csv").then(function(data) {
        //string to int
        data.forEach(function(d) {
            d["NOM arrival"] = +d.NOMArrival.replace(/,/g, "");
            d["NOM departure"] = +d.NOMDeparture.replace(/,/g, "");
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
        .domain(data.map(function(d) { return d.VisaType; }));

        var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d.NOMArrival; })]);

            // Create the bars
        svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.VisaType); })
        .attr("y", function(d) { return y(d.NOMArrival); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.NOMArrival); });

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

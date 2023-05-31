// set the dimensions and margins of the graph
var margin = {top: 50, right: 25, bottom: 50, left: 25};
var width = 850;
var height = 450;

// append the svg object to the body of the page
var svg = d3.select("#vis")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(30, 0)");

//Parsing the Data through csv method
d3.csv("/resources/top20total.csv").then(function(data){
//csv file details
//total = total number of immigrants in thousands.
//country = Immigrant country of birth
//parent is the parent column doesn't refer to any statistics, it is added formatting for d3 v5 compatibility.
//China refers to the People's Republic of China/Mainland China, Hong Kong is counted separetly. 

//Counting up for each row in csv file.
//Enabled allows for each 'total' value in the csv file to be read. 
data.forEach(function(d) {
    d.total = +d.total;
    d.enabled = true;
  });


    //Mapping out data
    var total = d3.sum(data.map(function(d) {
    if (d.enabled = true)
      return d.total;
    else
      return d.total = 0;  
    }));


//Stratifying data, determining hierarchy of csv file.
var treeData = d3.stratify()
  .id(function(d){return d.country;})
  .parentId(function(d){return d.parent;})
  (data);

//Computes sum of all 'total values'
treeData.sum(function(d){return d.total;})

d3.treemap()
  .size([width, height])
  .padding(1)
  (treeData);

// create a tooltip
var tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip");

//Mouseover Event
//Changes opacity whenever the user's mouse is over a selected treemap cell.
var mouseover = function(d) {
  tooltip
      .text("Number of migrants is approximately: " + (d.data.total * 1000))
      .style("opacity", 1)
      
  d3.select(this)
      .style("opacity", .5)
};


//Mouse leave event
var mouseleave = function(d) {
  tooltip.style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 1)
};

//Creating rectangles
svg.selectAll("rect")
  .data(treeData.leaves())
  .join("rect")
    .attr('x', function(d){return d.x0;} )
    .attr('y', function(d){return d.y0;} )
    .attr('width', function(d){return d.x1 - d.x0;})
    .attr('height', function(d){return d.y1 - d.y0;})
    .style("stroke", "none")
    .style("fill", "#0072BC")
  .on("mouseover", mouseover)
  .on("mouseleave", mouseleave);


 //Country Labels 
svg.selectAll("text-country")
  .data(treeData.leaves())
  .join("text")
    .attr("class", "tree-label")
    .attr("x", function(d){return d.x0+5;})
    .attr("y",  function(d){return d.y0+25;})
    .text(function(d){return d.data.country;})
    .attr("font-size", "12px")
    .attr("fill", "#ffffff");

//Country of Birth Population Numbers
svg.selectAll("text-total")
  .data(treeData.leaves())
  .join("text")
    .attr("class", "tree-label")
    .attr("x", function(d){return d.x0+5;})
    .attr("y",  function(d){return d.y0+50;})
    .text(function(d){return d.data.total;})
    .attr("font-size", "12px")
    .attr("fill", "#ffffff");


//Text % value labels.
svg.selectAll("text-number")
  .data(treeData.leaves())
  .join("text")
    .attr("class", "tree-label")
    .attr("x", function(d){return d.x0+5;})
    .attr("y", function(d){return d.y0+10;})
    .text(function(d){return Math.round(1000 * d.data.total / total) / 10 + "%";}) //Rouning to first decimal point
    .attr("font-size", "12px")
    .attr("fill", "#ffffff");
});
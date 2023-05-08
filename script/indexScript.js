function init(){
    //initailisation of variables 
    var w = 1000; 
    var h = 1000; 
    var padding = 25; 
    
    //selecting chart 
    var svg = d3.select("#chart")
            .append("svg")
            .attr("width", w + padding)
            .attr("height", h + padding);

    //importing of data from csv
    d3.csv("resources\netMigrationCalendarYear2004-2019.csv").then(function(data) {
        console.log(data)
    });

};
window.onload = init
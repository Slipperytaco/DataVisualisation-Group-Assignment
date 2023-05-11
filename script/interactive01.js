function initInteractive(){
    //function to interactively change graph to display details regarding the amount and type of visas
    
    //drop down menu options - Years to select details for:
    var allGroup = ["2004", "2005", "2006", "2007"];
    var dropdown = d3.select("#yearSelector")
        .append('select')
    
    //add options to button
    dropdown //adds button 
        .selectALl('myOptions')
            .data(allGroup)
        .enter()
            .append('option')
        .text(function(d) { return d; })  //shows text in menu
        .attr("value", function(d) { return d; }) //corresponding value returned by the button 
    
    //initalize the new data - bar graphs 
    

};
window.onload = initInteractive;
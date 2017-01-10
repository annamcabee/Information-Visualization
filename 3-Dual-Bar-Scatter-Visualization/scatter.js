var margin = {top: 20, right: 0, bottom: 30, left: 0};
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var padding = 80;
// pre-cursors
// -------------------- for the Scattor Plot --------------------
var sizeForCircle = function(d) {
  // TODO.0: modify the size used in line 93
  return 8*d["Serving Size Weight"];
}
var x = d3.scale.ordinal().rangeRoundBands([0, width-20], .05);
var y = d3.scale.linear().range([height, 0]);
var xAxisBar = d3.svg.axis().scale(x).orient("bottom");
var yAxisBar = d3.svg.axis().scale(y).orient("left");

// setup x
var xValue = function(d) { return d.Calories;}, // data -> value
    xScale = d3.scale.linear().range([0, width - 20]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d["Sugars"];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var yValueBar = function(d) { return d["AvgCal"];};

// setup fill color
var cValue = function(d) { return d.Manufacturer;},
    color = d3.scale.category10();

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var myMan = [{Manufacturer: "Nabisco", AvgCal: 0}, {Manufacturer: "Quaker Oats", AvgCal: 0}, 
        {Manufacturer: "Kelloggs", AvgCal: 0}, {Manufacturer: "Ralston Purina", AvgCal: 0}, {Manufacturer: "General Mills", AvgCal: 0}, 
        {Manufacturer: "Post", AvgCal: 0}, {Manufacturer: "American Home Food Products", AvgCal: 0}];

var myManO = ["Nabisco", "Quaker Oats", "Kelloggs", "Ralston Purina", "General Mills", "Post", "American Home Food Products"];
var manToCalories = [];
var manToCount = [];
function calorieByMan(man, cal) {
 // console.log(man);
  //console.log(cal);
  var index = myManO.indexOf(man);
  if (manToCalories[index] != null) {
    manToCalories[index] = (manToCalories[index] + cal);
    manToCount[index]++;
  } else {
    manToCalories[index] = cal;
    manToCount[index] = 1;
  }
  //console.log(manToCalories[index]);
}

function averageCal(man) {
  console.log("averageCal");
 // console.log(myMan);
  myMan.forEach(function(m) {
    console.log(m["Manufacturer"]);
    var index = myManO.indexOf(man);
    if (m["Manufacturer"] == man) {
        console.log("Match found!");

        console.log(manToCalories[index] / manToCount[index]);
        m["AvgCal"] = manToCalories[index] / manToCount[index];
        console.log(m);
      }
  })
  
}
//creating first scatter
var scatter1 = d3.select("body")
.append("svg")
.style("width", width + padding) // TODO.8: add space between first and second scatter
.style("height", height + margin.bottom)  //svg defalt size: 300*150
.append("g")

var bar = d3.select("body")
.append("svg")
.style("width", width + padding) // TODO.8: add space between first and second scatter
.style("height", height + margin.bottom)  //svg defalt size: 300*150
.append("g")

//creating the second scatter
var scatter2 = d3.select("body")
.append("svg")
.style("width", width)
.style("height", height + margin.bottom)  //svg defalt size: 300*150
.append("g")
//load data
d3.csv("Cereal.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Calories = +d.Calories;
    d.Sugars = +d.Sugars;
    d.Manufacturer = d.Manufacturer;
    calorieByMan(d.Manufacturer, d.Calories);
  });

  var newY = [];
  myManO.forEach(function(e) {

     console.log(e);
    averageCal(e);
  //  console.log(newY);
  });

  myMan.forEach(function(d) {
    d.AvgCal = +d.AvgCal;
    d.Manufacturer = d.Manufacturer;
  });


  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  x.domain(data.map(function(d) { return d.Manufacturer; }));
  y.domain([d3.min(myMan, yValueBar)-1, d3.max(myMan, yValueBar)+1]);

// -------------------- Drawing the scattor plot --------------------
  // x-axis
  scatter1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Calories");

  // y-axis
  scatter1.append("g")
      .attr("class", "y axis")
      .attr("fill", "white")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Sugars");

  // draw dots
  scatter1.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", sizeForCircle)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("click", function(d) {
        console.log("clicked");
          bar.selectAll(".rect")
            .transition()
            .duration(500)
            .delay(function(d, i) { return i * 10})
            .style("fill", function(e, i) {
              if (d["Calories"] < e["AvgCal"]) {
                console.log(d["Calories"] + "d");
                console.log(e["AvgCal"]);
                return "#FF69B4";
              } else {
                console.log(d["Calories"] + "d");
                console.log(e["AvgCal"]);
                return "white";
              }
          });


      });
      // setup scatter2 using scatter1 axis data
   

  // bar graph
  bar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxisBar)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Manufacturer");

  bar.append("g")
      .attr("class", "y axis")
      .attr("fill", "white")
      .call(yAxisBar)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Calories");

  bar.selectAll(".rect")
      .data(myMan)
    .enter().append("rect")
      .attr("class", "rect")
      .style("stroke", "#3BB6B6")
      .style("stroke-width", 0.5)
      .style("fill", function(d) { return color(cValue(d));})
      .attr("x", function(d) { return x(d["Manufacturer"]) + 30; })
      .attr("width", 10)
      .attr("y", function(d) { 
        console.log("y");
        console.log(d["AvgCal"]);
        return y(d["AvgCal"]); 
      })
      .attr("height", function(d) { 
        return height - y(d["AvgCal"]); 
      })      
      .on("click", function(d) {
          scatter1.selectAll(".dot")
            .transition()
            .duration(500)
            .delay(function(d, i) { return i * 10})
            .style("opacity", function(e) {
              if (d["Manufacturer"] != e["Manufacturer"]) {
                return .25;
              } else {
                return 1;
              }
        });


      });



  var legend = scatter1.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      // TODO.9: moves the legend to the center of the two plots
      .attr("transform", function(d, i) { return "translate(" + (padding-20) + ", " + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 20)
      .attr("width", 18)
      .attr("height", 18)
      .attr("transform", "translate(0," + 250 + ")")
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 23)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .attr("transform", "translate(0," + 250 + ")")
      .text(function(d) { return d;});


// TODO.1: setup brush scale by using current x,y scales




  // TODO.10: call brush method here;

});
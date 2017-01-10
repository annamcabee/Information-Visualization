var margin = {top: 20, right: 100, bottom: 50, left: 80},
    width = 900 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var datasets = { "orig": null, "dept":null, "m2o": {}};

var init_order = ["CHEM", "CS", "ENGL", "HTS", "MATH", "MGT", "PHYS", "PSYC"];
var t2dix = {};

for (var i = 0; i < init_order.length; i++) {
  t2dix[init_order[i]] = i;
}


function init() {
  svg = d3.select('#svg_container').append('avg');

  svg.attr("witdth", witdth + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom);

  vis = svg.append('g')
        .attr("transform", "tranlate(" + margins.left 
          + "," + margins.top + ")");
  d3.csv("Courses.csv", onDataArrival);

}

function onDataArrival(error, data) {
  if (error) {
    console.warn(error);
    return;
  }

  datasets["orig"] = data;

  data.forEach(function(d) {
      d["Course Number"] = +d["Course Number"];
      d["GPA"] = +d["GPA"];
      d["Department"] = d["Department"];
  });

}      

function colorForBar(d) {
  if (d.Department == "CS") {
    return "#cc0000";
  } else {
    return "steelblue";
  }

}

function filter_selection() {
  // Getting the value from the <input> with id "cut_off"
  // Refert to HTML to find it:)
  var type_selected = d3.select("#type_filter").node().value
  console.log(type_selected)

  // States to show
  var selected = svg.selectAll("rect").filter(function(d) {
    return type_selected == d["Department"]
  })
  console.log(selected)
  selected.transition().duration(300)
    .delay(function(d, i) { return i * 100 })
    .style("fill", "#fffff")
}

function filter_GPA() {
  // Getting the value from the <input> with id "cut_off"
  // Refert to HTML to find it:)
  var type_selected = d3.select("#type_filter").node().value
  console.log(type_selected)

  // States to show
  var selected = svg.selectAll("rect").filter(function(d) {
    return type_selected == d["Department"]
  })
  console.log(selected)
  selected.transition().duration(300)
    .delay(function(d, i) { return i * 100 })
    .style("fill", "#fffff")
}

var x = d3.scale.linear().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#cfcfcf");



d3.csv("Courses.csv", function(error, data) {
    datasets["orig"] = data


    data.forEach(function(d) {
        d["Course Number"] = +d["Course Number"];
        d["GPA"] = +d["GPA"];
        d["Department"] = d["Department"];
    });
  
  x.domain([1000, d3.max(data, function(d) { return d["Course Number"]; })]);
  y.domain([0, d3.max(data, function(d) { return d["GPA"]; })]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("x", function(d) { return x.range()/2 - 30; })
      .attr("dx", "-.01em")
      .attr("dy", "+.70em");

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + 36)
    .attr("y", height + 34)
    .style("font-weight", "bold")
    .text("Course Number");

  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -34)
    .attr("x", -200)
    .attr("transform", "rotate(-90)")
    .style("font-weight", "bold")
    .text("GPA");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end");




  svg.selectAll("bar").data(data)
      .enter().append("rect")
      .style("fill", function(d) { return colorForBar(d); })
      .style("stroke", "#000000")
      .style("stroke-width", 0.5)
      .attr("x", function(d) { console.log(d["Course Number"]); return x(d["Course Number"]); })
      .attr("width", 10)
      .attr("y", function(d) { return y(d["GPA"]); })
      .attr("height", function(d) { return height - y(d["GPA"]); });




});





var svg;
var vis;
var bad_course_nums = [];

var margin = {top: 30, right: 10, bottom: 30, left: 10},
    width = 900,
    height = 540;

var h_cal = height*2/3;
var w_cal = width*2/3;
var h_gap = 25;
var all_rects = null;

var datasets = { "orig": null, "dept":null, "m2o": {}};

var init_order = ["CHEM", "CS", "ENGL", "HTS", "MATH", "MGT", "PHYS", "PSYC"];
var t2dix = {};

for (var i = 0; i < init_order.length; i++) {
  t2dix[init_order[i]] = i;
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function init() {
  svg = d3.select('#svg_container').append('svg');
  svg.attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom);
  vis = svg.append('g')
        .attr("transform", "tranlate(" + margin.left 
          + "," + margin.top + ")");
  d3.csv("Courses.csv", onDataArrival);
}

function onDataArrival(error, data) {
  if (error) {
    console.warn(error);
    return;
  }

  datasets["orig"] = data;
  console.log("csv data loaded");

  data.forEach(function(d) {
      d["Course Number"] = +d["Course Number"];
      if (d["GPA"] == "") {
        bad_course_nums.push(d["Course Number"]);
        console.log(bad_course_nums);
        console.log("blank GPA");
        console.log(d["GPA"]);
      }
      d["GPA"] = +d["GPA"];
      d["Department"] = d["Department"];
  });

  var x = d3.scale.linear().range([0, width]);

  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("right")
      .tickSize(10);


  x.domain([0, d3.max(data, function(d) { return d["Course Number"]; })]);
  y.domain([0, d3.max(data, function(d) { return d["GPA"]; })]);

  // x-axis
  console.log(x.range());
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("x", function(d) { return x.range()/2 - 30; })
      .attr("dx", "-.01em")
      .attr("dy", "+.70em");

  // y axis
  svg.append("g")
    .attr("class", "axis y")
    .attr("transform", "translate (" + 10 + " 0)")
    .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -200)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  // x axis label
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + 36)
    .attr("y", height + 34)
    .style("font-weight", "bold")
    .text("Course Number");

  // y axis label
  svg.append("text")
    .attr("class", "label y")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("GPA");

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 - 400)
    .attr("y", height - 530)
    .style("font-weight", "bold")
    .text("GPA");




  svg.selectAll("bar").data(data)
      .enter().append("rect")
      .style("fill", "#3BB6B6")
      .style("stroke", "#000000")
      .style("stroke-width", 0.5)
      .attr("x", function(d) { return x(d["Course Number"]); })
      .attr("width", 10)
      .attr("y", function(d) { return y(d["GPA"]); })
      .attr("height", function(d) { 
        if (!contains(bad_course_nums, d["Course Number"]) && d["GPA"] > 0.0 && d["GPA"] <= 4.0) {
            console.log(d["GPA"]);
            return height - y(d["GPA"]); 
        } else {
            console.log("bad " + d["GPA"]);

        }
      });

}      

function colorForBar(d) {
  if (d.Department == "CS") {
    return "#cc0000";
  } else {
    return "steelblue";
  }

}

function filter_department() {
  var all_rects = svg.selectAll("rect")
  var type_selected = d3.select("#type_filter").node().value
  console.log(type_selected)
  var selected1 = svg.selectAll("rect").filter(function(d) {
    return type_selected == d["Department"] || type_selected == "all"
  })
  selected1.transition().duration(400)
    .delay(function(d, i) { return i * 50})
    .style("fill", "cc0000")
    .style("stroke", "black")

  if (type_selected != "all") {
    console.log("aaaa")
    var selected = svg.selectAll("rect").filter(function(d) {
        return type_selected != d["Department"]
      })
      console.log(selected)
      selected.transition()
        .delay(function(d, i) { return i * 40})
        .style("fill", "transparent")
        .style("stroke", "transparent")
  }
  
  
  console.log(all_rects)

}



function filter_GPA() {
  console.log(document.getElementById("minGPA").value)
  var type_selected = document.getElementById("minGPA").value

  var all_rects = svg.selectAll("rect")
  var selected1 = svg.selectAll("rect").filter(function(d) {
    return type_selected <= d["GPA"]
  })

  console.log("1: " + selected1)
  selected1.transition().duration(4000)
    .delay(function(d, i) { return i * 50})
    .style("fill", "#3BB6B6")
    .style("stroke", "black")


  var selected = svg.selectAll("rect").filter(function(d) {
    return type_selected > d["GPA"]
  })
  console.log(selected)
  selected.transition()
    .delay(function(d, i) { return i * 40})
    .remove()

  }

function transition_back(rects) {
  console.log(rects)
  rects.transition().duration(3000)
    .delay(function(d, i) { return i * 100 })
    .style("fill", "#3BB6B6")
    .style("stroke", "black")
}


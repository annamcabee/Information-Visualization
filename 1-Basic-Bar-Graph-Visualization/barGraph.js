var data = [4, 8, 4, 16, 12, 20];
var chart = d3.select("body")
            .append("svg")
            .attr("class", "chart")
            .attr("width", 420)
            .attr("height", 600);

var bar = chart.selectAll("rect")
          .data(data).enter()
          .append("rect")
            .attr("transform", function(d, i) {
              return "translate(0," + i*90 + ")";
            })
            .attr("width", function(d,i) {return d*10;})
            .attr("height", 19);

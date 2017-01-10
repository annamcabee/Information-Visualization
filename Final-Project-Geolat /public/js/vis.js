/*jshint sub:true*/

var originalData;
var map;
var plot;

var countries;

var xVar;
var yVar;
var xFullRange;
var yFullRange;
var xFilteredRange;
var yFilteredRange;

// Map 3 letter country codes to continents
var COUNTRY_MAPPING = {
    AFG: { fillKey: 'Asia' },
    AGO: { fillKey: 'Africa' },
    ALB: { fillKey: 'Europe' },
    ARE: { fillKey: 'Asia' },
    ARG: { fillKey: 'South America' },
    ARM: { fillKey: 'Asia' },
    ATA: { fillKey: 'Antarctica' },
    ATF: { fillKey: 'Antarctica' },
    AUS: { fillKey: 'Australia' },
    AUT: { fillKey: 'Europe' },
    AZE: { fillKey: 'Asia' },
    BDI: { fillKey: 'Africa' },
    BEL: { fillKey: 'Europe' },
    BEN: { fillKey: 'Africa' },
    BFA: { fillKey: 'Africa' },
    BGD: { fillKey: 'Asia' },
    BGR: { fillKey: 'Europe' },
    BHS: { fillKey: 'North America' },
    BIH: { fillKey: 'Europe' },
    BLR: { fillKey: 'Europe' },
    BLZ: { fillKey: 'North America' },
    BOL: { fillKey: 'South America' },
    BRA: { fillKey: 'South America' },
    BRN: { fillKey: 'Asia' },
    BTN: { fillKey: 'Asia' },
    BWA: { fillKey: 'Africa' },
    CAF: { fillKey: 'Africa' },
    CAN: { fillKey: 'North America' },
    CHE: { fillKey: 'Europe' },
    CHL: { fillKey: 'South America' },
    CHN: { fillKey: 'Asia' },
    CIV: { fillKey: 'Africa' },
    CMR: { fillKey: 'Africa' },
    COD: { fillKey: 'Africa' },
    COG: { fillKey: 'Africa' },
    COL: { fillKey: 'South America' },
    CRI: { fillKey: 'North America' },
    CUB: { fillKey: 'North America' },
    CYP: { fillKey: 'Asia' },
    CZE: { fillKey: 'Europe' },
    DEU: { fillKey: 'Europe' },
    DJI: { fillKey: 'Africa' },
    DNK: { fillKey: 'Europe' },
    DOM: { fillKey: 'North America' },
    DZA: { fillKey: 'Africa' },
    ECU: { fillKey: 'South America' },
    EGY: { fillKey: 'Africa' },
    ERI: { fillKey: 'Africa' },
    ESP: { fillKey: 'Europe' },
    EST: { fillKey: 'Europe' },
    ETH: { fillKey: 'Africa' },
    FIN: { fillKey: 'Europe' },
    FJI: { fillKey: 'Australia' },
    FLK: { fillKey: 'South America' },
    FRA: { fillKey: 'Europe' },
    GUF: { fillKey: 'South America' },
    GAB: { fillKey: 'Africa' },
    GBR: { fillKey: 'Europe' },
    GEO: { fillKey: 'Asia' },
    GHA: { fillKey: 'Africa' },
    GIN: { fillKey: 'Africa' },
    GMB: { fillKey: 'Africa' },
    GNB: { fillKey: 'Africa' },
    GNQ: { fillKey: 'Africa' },
    GRC: { fillKey: 'Europe' },
    GRL: { fillKey: 'North America' },
    GTM: { fillKey: 'North America' },
    GUY: { fillKey: 'South America' },
    HND: { fillKey: 'North America' },
    HRV: { fillKey: 'Europe' },
    HTI: { fillKey: 'North America' },
    HUN: { fillKey: 'Europe' },
    IDN: { fillKey: 'Asia' },
    IND: { fillKey: 'Asia' },
    IRL: { fillKey: 'Europe' },
    IRN: { fillKey: 'Asia' },
    IRQ: { fillKey: 'Asia' },
    ISL: { fillKey: 'Europe' },
    ISR: { fillKey: 'Asia' },
    ITA: { fillKey: 'Europe' },
    JAM: { fillKey: 'North America' },
    JOR: { fillKey: 'Asia' },
    JPN: { fillKey: 'Asia' },
    KAZ: { fillKey: 'Asia' },
    KEN: { fillKey: 'Africa' },
    KGZ: { fillKey: 'Asia' },
    KHM: { fillKey: 'Asia' },
    KOR: { fillKey: 'Asia' },
    KWT: { fillKey: 'Asia' },
    LAO: { fillKey: 'Asia' },
    LBN: { fillKey: 'Asia' },
    LBR: { fillKey: 'Africa' },
    LBY: { fillKey: 'Africa' },
    LKA: { fillKey: 'Asia' },
    LSO: { fillKey: 'Africa' },
    LTU: { fillKey: 'Europe' },
    LUX: { fillKey: 'Europe' },
    LVA: { fillKey: 'Europe' },
    MAR: { fillKey: 'Africa' },
    MDA: { fillKey: 'Europe' },
    MDG: { fillKey: 'Africa' },
    MEX: { fillKey: 'North America' },
    MKD: { fillKey: 'Europe' },
    MLI: { fillKey: 'Africa' },
    MMR: { fillKey: 'Asia' },
    MNE: { fillKey: 'Europe' },
    MNG: { fillKey: 'Asia' },
    MOZ: { fillKey: 'Africa' },
    MRT: { fillKey: 'Africa' },
    MWI: { fillKey: 'Africa' },
    MYS: { fillKey: 'Asia' },
    NAM: { fillKey: 'Africa' },
    NCL: { fillKey: 'Australia' },
    NER: { fillKey: 'Africa' },
    NGA: { fillKey: 'Africa' },
    NIC: { fillKey: 'North America' },
    NLD: { fillKey: 'Europe' },
    NOR: { fillKey: 'Europe' },
    NPL: { fillKey: 'Asia' },
    NZL: { fillKey: 'Australia' },
    OMN: { fillKey: 'Asia' },
    PAK: { fillKey: 'Asia' },
    PAN: { fillKey: 'North America' },
    PER: { fillKey: 'South America' },
    PHL: { fillKey: 'Asia' },
    PNG: { fillKey: 'Australia' },
    POL: { fillKey: 'Europe' },
    PRI: { fillKey: 'North America' },
    PRK: { fillKey: 'Asia' },
    PRT: { fillKey: 'Europe' },
    PRY: { fillKey: 'South America' },
    QAT: { fillKey: 'Asia' },
    ROU: { fillKey: 'Europe' },
    RUS: { fillKey: 'Europe' },
    RWA: { fillKey: 'Africa' },
    ESH: { fillKey: 'Africa' },
    SAU: { fillKey: 'Asia' },
    SDN: { fillKey: 'Africa' },
    SSD: { fillKey: 'Africa' },
    SEN: { fillKey: 'Africa' },
    SLB: { fillKey: 'Australia' },
    SLE: { fillKey: 'Africa' },
    SLV: { fillKey: 'North America' },
    SOM: { fillKey: 'Africa' },
    SRB: { fillKey: 'Europe' },
    SUR: { fillKey: 'South America' },
    SVK: { fillKey: 'Europe' },
    SVN: { fillKey: 'Europe' },
    SWE: { fillKey: 'Europe' },
    SWZ: { fillKey: 'Africa' },
    SYR: { fillKey: 'Asia' },
    TCD: { fillKey: 'Africa' },
    TGO: { fillKey: 'Africa' },
    THA: { fillKey: 'Asia' },
    TJK: { fillKey: 'Asia' },
    TKM: { fillKey: 'Asia' },
    TLS: { fillKey: 'Asia' },
    TTO: { fillKey: 'North America' },
    TUN: { fillKey: 'Africa' },
    TUR: { fillKey: 'Asia' },
    TWN: { fillKey: 'Asia' },
    TZA: { fillKey: 'Africa' },
    UGA: { fillKey: 'Africa' },
    UKR: { fillKey: 'Europe' },
    URY: { fillKey: 'South America' },
    USA: { fillKey: 'North America' },
    UZB: { fillKey: 'Asia' },
    VEN: { fillKey: 'South America' },
    VNM: { fillKey: 'Asia' },
    VUT: { fillKey: 'Australia' },
    PSE: { fillKey: 'Asia' },
    YEM: { fillKey: 'Asia' },
    ZAF: { fillKey: 'Africa' },
    ZMB: { fillKey: 'Africa' },
    ZWE: { fillKey: 'Africa' }
};
// Map continents and other key words to specific color codes
var COLOR_MAPPING = {
    "North America": "#1b9e77",
    "South America": "#d95f02",
    "Australia": "#7570b3",
    "Asia": "#e7298a",
    "Europe": "#66a61e",
    "Africa": "#e6ab02",
    'bubble': '#001F3F',
    defaultFill: '#FFDC00'
};
// Map variable short names to longer presentation strings
var VARIABLE_MAPPING = {
    rtt: "Round Trip Time",
    distance: "Distance",
    speed: "Speed (Distance/Time)"
};
// Server location used in creation of the arcs shown in the map
var SERVER = {latitude: 39.043720245361, longitude: -77.487487792969};

// On document read, retrieve json, initialize, and render the visualizations
$(document).ready(function() {
    // Get the data fron a json endpoint, store the original data, and initialize the map
    $.getJSON( "/results", function( data ) {
        originalData = data;
        initialize();
        render();
    });
});

// Initialize global vars, and set up on page elements
function initialize() {
    countries = [];
    xVar = $("#xSelect")[0].value;
    yVar = $("#ySelect")[0].value;
    xFullRange = [0, 0];
    yFullRange = [0, 0];
    xFilteredRange = [0, 0];
    yFilteredRange = [0, 0];

    colorLabels();
    createAndWatchSliders();
    watchCheckboxes();
    watchSelectors();

    map = createMap();
    plot = createScatter();

    updateSliders();
}

// Filter data based on user selections and re-render the visualizations
function render(options) {
    var filteredData = originalData;

    if (countries.length > 0) {
        filteredData = filteredData.filter(function(e) {
            return countries.includes(e.continent);
        });
    }

    filteredData = filteredData.filter(function(e) {
        return e[xVar] >= xFilteredRange[0] && e[xVar] <= xFilteredRange[1] && e[yVar] >= yFilteredRange[0] && e[yVar] <= yFilteredRange[1];
    });

    if (options && options.axes) { renderAxes(filteredData); }

    renderMap(filteredData);
    renderScatter(filteredData, options);
}

// Color the checkbox labels to match continent coloring. Serves as a legend
function colorLabels() {
    $("#continent-0").css("color", COLOR_MAPPING["Africa"]);
    $("#continent-1").css("color", COLOR_MAPPING["Asia"]);
    $("#continent-2").css("color", COLOR_MAPPING["Australia"]);
    $("#continent-3").css("color", COLOR_MAPPING["Europe"]);
    $("#continent-4").css("color", COLOR_MAPPING["North America"]);
    $("#continent-5").css("color", COLOR_MAPPING["South America"]);
}

// Create JQuery UI sliders that update labels and filter the vis when slid
function createAndWatchSliders() {
    $("#x-values").text("X range: " + xFullRange[0] + "-" + xFullRange[1]);
    $("#y-values").text("Y range: " + yFullRange[0] + "-" + yFullRange[1]);

    $("#x-range-slider").slider({
        range: true,
        min: xFullRange[0],
        max: xFullRange[1],
        values: [xFullRange[0], xFullRange[1]],
        slide: function(event, ui) {
            var values = $(this).slider( "option", "values" );
            $("#x-values").text("X range: " + values[0] + "-" + values[1]);
            xFilteredRange[0] = values[0];
            xFilteredRange[1] = values[1];
            render();
        }
    });

    $("#y-range-slider").slider({
        range: true,
        min: yFullRange[0],
        max: yFullRange[1],
        values: [yFullRange[0], yFullRange[1]],
        slide: function(event, ui) {
            var values = $(this).slider( "option", "values" );
            $("#y-values").text(" Y range:" + values[0] + "-" + values[1]);
            yFilteredRange[0] = values[0];
            yFilteredRange[1] = values[1];
            render();
        }
    });
}

// When a country is checked by the user, add that country to a global list and filter on it
function watchCheckboxes() {
    $("input[type='checkbox']").change(function() {
        countries = [];
        if (document.getElementById('continent-Africa').checked) { countries.push('Africa'); }
        if (document.getElementById('continent-Asia').checked) { countries.push('Asia'); }
        if (document.getElementById('continent-Australia').checked) { countries.push('Australia'); }
        if (document.getElementById('continent-Europe').checked) { countries.push('Europe'); }
        if (document.getElementById('continent-North America').checked) { countries.push('North America'); }
        if (document.getElementById('continent-South America').checked) { countries.push('South America'); }
        render({axes: true});
    });
}

// Watch x and y variable selectors, update sliders to reflect new variables, and re-render the vis including plot axes
function watchSelectors() {
    $("select").change(function() {
        xVar = $("#xSelect")[0].value;
        yVar = $("#ySelect")[0].value;
        updateSliders();
        render({ axes: true });
    });
}

// Update global variables and the JQuery UI sliders
function updateSliders() {
    var xMin = d3.min([0, d3.min(originalData, function (d) { return d[xVar]; })]);
    var xMax = d3.max(originalData, function (d) { return d[xVar]; });
    var yMin = d3.min([0, d3.min(originalData, function (d) { return d[yVar]; })]);
    var yMax = d3.max(originalData, function (d) { return d[yVar]; });

    xFullRange = [xMin, xMax];
    yFullRange = [yMin, yMax];

    xFilteredRange = [xMin, xMax];
    yFilteredRange = [yMin, yMax];

    $("#x-values").text("X range: " + xFullRange[0] + "-" + xFullRange[1]);
    $("#y-values").text("Y range: " + yFullRange[0] + "-" + yFullRange[1]);
    $("#x-range-slider").slider("option", "min", xFullRange[0]);
    $("#x-range-slider").slider("option", "max", xFullRange[1]);
    $("#x-range-slider").slider("option", "values", [xFullRange[0], xFullRange[1]]);
    $("#y-range-slider").slider("option", "min", yFullRange[0]);
    $("#y-range-slider").slider("option", "max", yFullRange[1]);
    $("#y-range-slider").slider("option", "values", [yFullRange[0], yFullRange[1]]);
}

// Initialize the datamap. Fills and data color the graph by continent
function createMap() {
    return new Datamap({
        element: document.getElementById('map'),
        scope: 'world',
        geographyConfig: {
            popupOnHover: false,
            highlightOnHover: false,
        },
        fills: COLOR_MAPPING,
        data: COUNTRY_MAPPING
    });
}

// Initialize the scatterplot.
function createScatter() {
    var data = originalData;

    var margin = { top: 20, right: 20, bottom: 20, left: 50 };
    var height = 500 - margin.top - margin.bottom;
    var width = 850 - margin.left - margin.right;

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d[xVar]; })])
        .range([0, width])
        .nice();

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d[yVar]; })])
        .range([height, 0])
        .nice();

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(10);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);

    // Adds the svg canvas
    var svg = d3.select("#scatterplot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

    // Add the tooltip div
    var tooltip = d3.select("#scatterplot").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append('text') // X-axis Label
        .attr('id', 'xAxisLabel')
        .attr('y',-10)
        .attr('x',width)
        .attr('dy','.71em')
        .style('text-anchor','end')
        .text(function() { return VARIABLE_MAPPING[xVar]; });

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append('text') // y-axis Label
        .attr('id', 'yAxisLabel')
        .attr('transform','rotate(-90)')
        .attr('x',0)
        .attr('y',5)
        .attr('dy','.71em')
        .style('text-anchor','end')
        .text(function() { return VARIABLE_MAPPING[yVar]; });

    // Return elements to be used during the update routine
    return {
        svg: svg,
        x: x,
        y: y,
        tooltip: tooltip
    };
}

// Render the map bubbles and arcs on specific data
function renderMap(data) {
    // Format the data based on the expectations of datamaps.
    data = data.map(function(element) {
        element.latitude = element.location.coordinates[0];
        element.longitude = element.location.coordinates[1];
        element.radius = Math.round(element.distance / element.rtt) / 10;
        element.fillKey = 'bubble';
        return element;
    });


    // Create the bubbles shown on the map
    map.bubbles(data, {
        popupTemplate: function(geo, element) {
            return ['<div class="hoverinfo">' +  element.date,
                    '<br/>' + element.country + ', ' + element.continent,
                    '<br/>Location: [' +  element.latitude + ',' + element.longitude + ']',
                    '<br/>RTT: ' +  element.rtt + ' ms',
                    '<br/>Distance: ' +  element.distance + ' mi',
                    '<br/>Speed: ' +  Math.round(element.distance / element.rtt) + ' mi/ms',
                    '</div>'].join('');
        },
        highlightFillColor: '#AAA',
        highlightBorderColor: '#555'
    });

    // Format the data for the arcs shown on the map
    var arcs = data.map(function(element) {
        element.origin = {
            latitude: element.latitude,
            longitude: element.longitude
        };
        element.destination = {
            latitude: SERVER.latitude,
            longitude: SERVER.longitude
        };
        return element;
    });

    // Create the arcs based on the data formatted above
    map.arc(arcs, {
        popupOnHover: true,
        popupTemplate: function(geo, element) {
            return ['<div class="hoverinfo">' +  element.date,
                    '<br/>' + element.country + ', ' + element.continent,
                    '<br/>Location: [' +  element.latitude + ',' + element.longitude + ']',
                    '<br/>RTT: ' +  element.rtt + ' ms',
                    '<br/>Distance: ' +  element.distance + ' mi',
                    '<br/>Speed: ' +  Math.round(element.distance / element.rtt) + ' mi/ms',
                    '</div>'].join('');
        },
        strokeColor: '#0074D9',
    });
}

// Render the scatter plot on specific data
function renderScatter(data, options) {
    var svg = plot.svg;
    var x = plot.x;
    var y = plot.y;
    var tooltip = plot.tooltip;

    // Select the points on the scatterplot
    var points = svg.selectAll("circle")
        .data(data, function(d) { return d.id; });

    // Enter - append circles to the points when they enter the dataset.
    points.enter().append("circle");

    // If the axes are changing, use a duration to animate the vis.
    var duration;
    if (options && options.axes) {
        duration = 1000;
    } else {
        duration = 0;
    }

    // Update - Update characteristics across all nodes.
    points.transition().duration(duration)
        .attr("r", 8)
        .attr("cx", function(d) { return x(d[xVar]); })
        .attr("cy", function(d) { return y(d[yVar]); })
        .attr('id', 'scatterDots')
        .attr('value', function (d) { return (d.continent); })
        .attr('stroke','white')
        .attr('stroke-width',1)
        .attr('fill',function (d) { return COLOR_MAPPING[d.continent]; });

    points.on('mouseover', function (d) {
        d3.selectAll('#scatterDots')
            .transition()
            .attr('opacity', 0.25);

        // Grow and highlight the node
        d3.select(this)
            .transition()
            .duration(100)
            .attr('r',14)
            .attr('stroke-width',3);

        // Format the tooltip with selected node's data
        tooltip.html([d.country + ', ' + d.continent,
                      '<br/>Location: [' +  d.latitude + ',' + d.longitude + ']',
                      '<br/>RTT: ' +  d.rtt + ' ms',
                      '<br/>Distance: ' +  d.distance + ' mi',
                      '<br/>Speed: ' +  Math.round(d.distance / d.rtt) + ' mi/ms'].join(''))
             .style("left", d3.select(this).attr("cx") - 10 + "px")
             .style("top", d3.select(this).attr("cy") - 100 + "px");

        // Transition the tooltip into the visualization
        tooltip.transition()
             .duration(200)
             .style("opacity", 0.75);
    }).on('mouseout', function(d) {
        // Reset styling of all nodes
        d3.selectAll('#scatterDots')
            .transition()
            .duration(100)
            .attr('opacity', 1)
            .attr("r", 8)
            .attr('stroke-width', 1);

        // Transition the tooltip away.
        tooltip.transition()
            .duration(200)
            .style("opacity", 0);
    });

    // Exit - Remove nodes no longer in the vis.
    points.exit().remove();
}

// Reset and render the axes when a new x or y variables is selected
function renderAxes(data) {
    var x = plot.x.domain([0, d3.max(data, function(d) { return d[xVar]; })]).nice();
    var y = plot.y.domain([0, d3.max(data, function(d) { return d[yVar]; })]).nice();

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(10);
    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);

    d3.selectAll("g.x.axis").transition().duration(1000).call(xAxis);
    d3.select('#xAxisLabel')
        .transition().duration(1000)
        .text(function() { return VARIABLE_MAPPING[xVar]; });

    d3.selectAll("g.y.axis").transition().duration(1000).call(yAxis);
    d3.select('#yAxisLabel')
        .transition().duration(1000)
        .text(function() { return VARIABLE_MAPPING[yVar]; });

}

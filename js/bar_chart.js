// SETUP

  var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 100, left: 40 },
    x = d3.scaleBand().padding(0.1),
    y = d3.scaleLinear(),
    theData = undefined;

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "rotate(90)")
    .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "start")
            .style("fill","black")
            .attr("transform", "rotate(90)");

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
            .append("text")
              .attr("transform", "rotate(-90)")
              .style("fill", "white")
              .attr("y", 10)
              .attr("dy", "-3.5em")
              .attr("text-anchor", "end")
              .text("Percentage (%)")
              .style("fill", "black");

  // g.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 6)
  //   .attr("dy", "0.71em")
  //   .attr("text-anchor", "end")
  //   .text("Percentage");


  var colors = d3.scaleOrdinal().domain(['None', 'Mild', 'Moderate', 'Severe']).range(['green', 'orange', 'pink', 'red' ])

  var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10000")
            .style("visibility", "hidden")
            .style("background", "white")
            .style("opacity", "0.8")
            .text("a simple tooltip");


  // DRAWING

  function draw() {

    var bounds = svg.node().getBoundingClientRect(),
        width = bounds.width - margin.left - margin.right,
        height = bounds.height - margin.top - margin.bottom;

    x.rangeRound([0, width]);
    y.rangeRound([height, 0]);

    g.select(".axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    g.select(".axis--y")
      .call(d3.axisLeft(y).ticks(8))


    var bars = g.selectAll(".bar")
      .data(theData);

    // ENTER
    bars
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x(d.Species); })
      .attr("y", function (d) { return y(d.Percentage); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.Percentage); })
      .attr("fill", function(d, i) { return colors(d.Allergenicity) })
      .text(function(d) { return d.Percentage; })
        .on("mouseover", function(d){tooltip.text(d.Species+": "+d.Percentage+"%"); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    // UPDATE
    bars.attr("x", function (d) { return x(d.Species); })
      .attr("y", function (d) { return y(d.Percentage); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.Percentage); });

    // EXIT
    bars.exit()
      .remove();

  }

  // LOADING DATA

  function loadData(tsvFile) {

    d3.tsv(tsvFile, function (d) {
      d.Percentage = +d.Percentage;
      return d;

    }, function (error, data) {
      if (error) throw error;

      theData = data;

      x.domain(theData.map(function (d) { return d.Species; }));
      y.domain([0, d3.max(theData, function (d) { return d.Percentage; })]);

      draw();

    });
  }

  // START
  window.addEventListener("resize", draw);
  loadData("data/data.tsv");

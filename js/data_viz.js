 //D3 interactive chart:
    var svg = d3.select("svg")

    margin = {top: 20, right: 50, bottom: 150, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

    var aspect = width / height,
    chart = d3.select('#chart');
    d3.select(window)
    .on("resize", function() {
    var targetWidth = chart.node().getBoundingClientRect().width;
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
    });


    var x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var colors = d3.scaleOrdinal().domain(['None', 'Mild', 'Moderate', 'Severe']).range(['green', 'orange', 'pink', 'red' ])


    d3.csv("top_20.csv", function(d) {
    d.Percentage = +d.Percentage;
    return d;
    }, function(error, data) {
    if (error) throw error;

          x.domain(data.map(function(d) { return d.Species; }));
          y.domain([0, d3.max(data, function(d) { return d.Percentage;})]);

          g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))
              .selectAll("text")
            .attr("y", 0)
            .attr("x", 20)
            .attr("dy", ".3em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start")
            .style("font-size","10px")
            .style("fill","black");
          
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

          g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.Species); })
              .attr("y", function(d) { return y(d.Percentage); })
              .attr("width", x.bandwidth())
              .attr("height", function(d) { return height - y(d.Percentage); })
              .attr("fill", function(d, i) { return colors(d.Allergenicity) })
              .text(function(d) { return d.Percentage; })
              .on("mouseover", function(d){tooltip.text(d.Species+": "+d.Percentage+"%"); return tooltip.style("visibility", "visible");})
              .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
              .on("mouseout", function(){return tooltip.style("visibility", "hidden");})

        });
        //Create tooltip for D3 chart
        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10000")
            .style("visibility", "hidden")
            .style("background", "white")
            .style("opacity", "0.8")
            .text("a simple tooltip");

  





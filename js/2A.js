(function() {

	var w = 700; 
	var h = 550;
	var padding = 60;

	var data03 = [];
	var data15 = [];
	var all_data = [];
	var curr_data;

	var xScale = d3.scale.linear();
	var	yScale = d3.scale.linear();
	var	rScale = d3.scale.linear();

	// main svg element
	var svg = d3.select("#scatterplot")
			.append("svg")
			.attr("height", h)
			.attr("width", w);

	// add a clip path to avoid points to cross the axes
	svg.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", padding)
			.attr("y", padding)
			.attr("width", w - padding * 3)
			.attr("height", h - padding * 2);

	// add the tooltip area to the webpage
	var tooltip = d3.select("body")
					.append("div")
				    .classed("tooltip", true)
				    .style("border-radius", "8px")

	d3.csv("data/data_combined.csv", function(data) {
		// parse strings as numbers
		data.forEach(function (d) {
			d.prostitution = +d.prostitution;
			d.vehicle_theft = +d.vehicle_theft;
			d.total = + d.total;

			// add all the data to a variable to get max of lon and lat of all the points
			all_data.push(d);

			// store the two data sets in two variables for easy handling
			if (d.year == "2003") {
				data03.push(d);
			} else if (d.year == "2015"){
				data15.push(d);
			}
		});

		createVis(data03);
	});


	function createVis(dataset){

		xScale.domain([0, d3.max(all_data, function(d) { return d.prostitution; }) + 87])
						 .range([padding, w - padding * 2]);

		yScale.domain([0, d3.max(all_data, function(d) { return d.vehicle_theft; }) + 184])
						 .range([h - padding, padding]);

		rScale.domain([0, d3.max(all_data, function(d) { return d.total; })])
						 .range([2,10]);

		var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(6);

		var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left")
							.ticks(5);

		// add group of all the data points
		svg.append("g")
			.attr("clip-path", "url(#chart-area)")
			.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("cx", function(d) {
				return xScale(d.prostitution);
			})
			.attr("cy", function(d) {
				return yScale(d.vehicle_theft);
			})
			.attr("r", function(d) {
				return rScale(d.total);
			})
	  	    .attr("fill", "lightgrey")
		    .style("stroke", "#000")
			.on("mouseover", function(d) {

				d3.select(this).attr("fill", "steelblue");

				// get x and y positions from the data points that is being hovered over
				var xPosition = parseFloat(d3.select(this).attr("cx")); 
				var yPosition = parseFloat(d3.select(this).attr("cy")) - 14;

				// add district name to tooltip
				d3.select("#tooltip")
				      .style("left", (xPosition-padding-25) + "px")
				      .style("top", yPosition + 250 + "px")
				      .select("#value_district")
				      .text(d.district);

				// add total crime count to tooltip
				d3.select("#tooltip")
				      .select("#value_count")
				      .text(d.total);
				
				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);



			    })
		    .on("mouseout", function(d) {

		    	d3.select(this).attr("fill", "lightgrey");
		    	// hide the tooltip
		    	d3.select("#tooltip").classed("hidden", true);
		    });

		// x axis
		svg.append("g")
			.classed("x axis", true)
			.attr("transform", "translate(0," + (h-padding) + ")")
			.call(xAxis)
	  		.append("text")
	  		.classed("axis_title", true)
			.attr("x", w/2)
			.attr("y", 50)
			.text("Vehicle Theft");

		// y axis
		svg.append("g")
			.classed("y axis", true)
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis)
	  		.append("text")
	  		.classed("axis_title", true)
			.attr("transform", "translate(" + -50 + "," + h/2+ ") rotate(-90)")
			.text("Prostitution");

		// title for the x-axis
		svg.append("text")
			.attr("id", "title")
			.attr("x", w/2)
			.attr("y", padding)
			.style("text-anchor", "middle")
			.text("Prostitution vs. Vehicle Theft: 2003");

		// set the new current data set
		curr_data = dataset;

	}

	function changeData(dataset, year){

		// only change the data if it's not already shown 
		if (curr_data != dataset) {
			svg.selectAll("circle")
			   .data(dataset)
			   .transition()
			   .duration(750)
			   .attr("cx", function(d) {
				   return xScale(d.prostitution);
			   })
			   .attr("cy", function(d) {
				   return yScale(d.vehicle_theft);
			   })
	  	       .attr("fill", "lightgrey")
			   .style("stroke", "#000")
			   .attr("r", function(d) {
			   		return rScale(d.total);
			   });
				
			// change the plot title to fit the data	
			svg.select("#title")
				.text("Prostitution vs. Vehicle Theft: " + year);

			// set the new current data set
			curr_data = dataset;
		}
		
	}

	// handle the toggle between the two data sets
	d3.selectAll("label.btn.btn-default")
			.on("click", function(){
				if (this.id == "scatter03") {
					changeData(data03, "2003");
				} else if (this.id == "scatter15") {
					changeData(data15, "2015");
				}
			});

})();
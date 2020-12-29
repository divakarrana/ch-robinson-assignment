import React, { useEffect } from 'react';
import * as d3 from "d3";

const BarChart = (props) => {

    const createBarChart = (chartType, barData) => {

        let subgroups = [];
        
        //Setting subgroups for Grouped Bar Charts
        subgroups.push('delivered');
        subgroups.push('undelivered');
            
        //Setting up chart margins
        let margin = {top: 20, right: 20, bottom: 30, left: 40};
        let width = 960 - margin.left - margin.right;
        let height = 500 - margin.top - margin.bottom;
            
        if(d3.select("svg")) {
            d3.select("svg").remove();
        }
        
        //Mounting svg on DOM
        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("svg:g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Setting up Y-axis
        var y = d3.scaleLinear()
            .domain([0, 90000])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(x => `${x/1000}k`));
        
        //Setting up X-axis
        var x = d3.scaleBand()
            .domain(barData.map((el) => el.month))
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));
    
        //Setting up colors for bars
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#55efc4','#0984e3']);
    
        if(chartType === 'Grouped'){
            
            //Setting subgroups for GROUPED bar chart
            var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])
            
            // Show the bars
            svg.append("g")
                .selectAll("g")
                .data(barData)
                .enter()
                .append("g")
                .attr("transform", (d) => { return "translate(" + x(d.month) + ",0)"; })
                .selectAll("rect")
                .data((d) => { return subgroups.map((key) => { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                .attr("x", (d) => { return xSubgroup(d.key); })
                .attr("y", (d) => { return y(d.value); })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", (d) => { return height - y(d.value); })
                .attr("fill", (d) => { return color(d.key); });
        
        //Stacked Bar Graph
        } else{     

            var stack = d3.stack()
                .keys(subgroups)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);
        
            var stackedData = stack(barData);
    
            // Show the bars
            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                .attr("fill", (d) => { return color(d.key); })
                .selectAll("rect")
                .data((d) => { return d; })
                .enter().append("rect")
                .attr("x", (d) => { return x(d.data.month); })
                .attr("y", (d) => { return y(d[1]); })
                .attr("height", (d) => { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth());
        }
    
        //Gridlines function in Y-axis
        const make_y_gridlines = () => {		
            return d3.axisLeft(y)
                    .ticks(7)
        }
    
        //Adding Y gridlines
        svg.append("g")			
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

        //LEGEND
        svg.append("circle").attr("cx",800).attr("cy",16).attr("r", 6).style("fill", '#55efc4')
        svg.append("circle").attr("cx",800).attr("cy",36).attr("r", 6).style("fill", '#0984e3')
        svg.append("text").attr("x", 815).attr("y", 16).text("Delivered").style("font-size", "12px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 815).attr("y", 36).text("Undelivered").style("font-size", "12px").attr("alignment-baseline","middle")
    }

    useEffect(() => {

        //Function to create bar charts
        createBarChart(props.chartType, props.barData);

        //Attaching events for user interaction
        let svgElement = document.querySelectorAll("rect");
    
        svgElement.forEach((el, i) => el.addEventListener("mouseenter", function (actual, i) {
            d3.select(this).attr('opacity', 0.7);
            d3.select(this).attr('cursor', 'pointer');
        }));

        svgElement.forEach((el, i) => el.addEventListener("mouseleave", function (actual, i) {
            d3.select(this).attr('opacity', 1)
        }));

        svgElement.forEach((el, i) => el.addEventListener("click", function (actual, i) {
            props.handleGraphChange(actual);
        }));

    }, [props]);

    return (
        <div id="chart" className="Chart">
            <p>Bar Graph Type &nbsp;
                <select value={props.chartType} onChange={props.handleGraphChange}>
                    <option value="Grouped">Grouped</option>
                    <option value="Stacked">Stacked</option>
                </select>
            </p>
        </div>
    );
}

export default BarChart;

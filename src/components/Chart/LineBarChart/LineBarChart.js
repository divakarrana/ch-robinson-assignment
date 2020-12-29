import React, { useEffect } from 'react';
import * as d3 from "d3";

const createLineBarChart = (lineBarData) => {
    //Setting up chart margins
    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    let width = 960 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;
        
    let subgroups = [];

    subgroups.push('current');
    subgroups.push('previous');

    if(d3.select("svg")) {
        d3.select("svg").remove();
    }
    
    //Mounting svg on DOM
    let svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("svg:g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Setting up y-axis for Bars
    let y = d3.scaleLinear()
        .domain([0, 120000])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(x => `$${x/1000}k`));

    //Label for left y-axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 2)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("SPEND($)"); 
    
    //Setting up X-axis for Bars
    let x = d3.scaleBand()
        .domain(lineBarData.map((el) => el.month))
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    //Setting up colors for bars
    let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#54a0ff", '#c7ecee']);

    //Setting up subgroups for grouped behaviour
    let xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])
        
    // Show the bars
    svg.append("g")
        .selectAll("g")
        .data(lineBarData)
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


    // Add Y axis for Line Graph
    let yLine = d3.scaleLinear()
        .domain([0, 120000])
        .range([ height, 0 ]);
    svg.append("g")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(yLine).tickFormat(x => `${x/1000}k`));

    //Label for right y-axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
        .attr("y", width-margin.right)
        .attr("x",0 - height/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("SHIPMENTS");
    
    //Setting up x-axis for Line graph
    let xLine = d3.scaleBand()
        .domain(lineBarData.map((el) => el.month))
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xLine).tickSizeOuter(0));

    // Add the line for PREVIOUS AMOUNT
    svg.append("path")
        .datum(lineBarData)
        .attr("fill", "none")
        .attr("stroke", "#10ac84")
        .attr("stroke-width", 1.5)
        .attr("transform", "translate(74,0)")
        .style("stroke-dasharray", ("3, 3"))
        .attr("d", d3.line()
            .x((d) => { return xLine(d.month) })
            .y((d) => { return yLine(d.previousAmount) })
        )

    //Add the line for CURRENT AMOUNT
    svg.append("path")
        .datum(lineBarData)
        .attr("fill", "none")
        .attr("stroke", "#341f97")
        .attr("stroke-width", 1.5)
        .attr("transform", "translate(25,0)")
        .attr("d", d3.line()
            .x((d) => { return xLine(d.month) })
            .y((d) => { return yLine(d.currentAmount) })
        )

    //Setting nodes for line graphs PREVIOUS AMOUNT
    svg.selectAll(".dot")
        .data(lineBarData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", (d, i) => { return xLine(d.month) })
        .attr("cy", (d) => { return yLine(d.previousAmount) })
        .attr("transform", "translate(74,0)")
        .style("fill", "#10ac84")
        .attr("r", 5)

    //Setting nodes for line graphs CURRENT AMOUNT
    svg.selectAll(".dot1")
        .data(lineBarData)
        .enter().append("circle")
        .attr("class", "dot1")
        .attr("cx", (d) => { return xLine(d.month) })
        .attr("cy", (d) => { return yLine(d.currentAmount) })
        .attr("transform", "translate(25,0)")
        .style("fill", "#341f97")
        .attr("r", 5)

    //Custom Legend for SHIPMENT in Line Bar Chart
    svg.append("text").attr("x", 790).attr("y", -12).text("SHIPMENTS").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx",800).attr("cy",6).attr("r", 6).style("fill", "#54a0ff")
    svg.append("circle").attr("cx",800).attr("cy",26).attr("r", 6).style("fill", '#c7ecee')
    svg.append("text").attr("x", 815).attr("y", 6).text("Current").style("font-size", "12px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 815).attr("y", 26).text("Previous").style("font-size", "12px").attr("alignment-baseline","middle")

    //Custom Legend for SPEND in Line Bar Chart
    svg.append("text").attr("x", 680).attr("y", -12).text("SPEND($)").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx",690).attr("cy",6).attr("r", 6).style("fill", "#341f97")
    svg.append("line").attr("x1",670).attr("x2",710).attr("y1", 6).attr("y2", 6).style("stroke", "#341f97").style("opacity", 1 );
    svg.append("line").attr("x1",670).attr("x2",710).attr("y1", 26).attr("y2", 26).style("stroke", "#10ac84").style("opacity", 1 ).style("stroke-dasharray", ("3, 3"));
    svg.append("circle").attr("cx",690).attr("cy",26).attr("r", 6).style("fill", '#10ac84')
    svg.append("text").attr("x", 715).attr("y", 6).text("Current").style("font-size", "12px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 715).attr("y", 26).text("Previous").style("font-size", "12px").attr("alignment-baseline","middle")
}


const LineBarChart = (props) => {

    useEffect(() => {

        //Function to create line bar charts
        createLineBarChart(props.lineBarData);

        document.querySelector("svg").style.width = 1000;

    }, [props]);

    return (
        <div id="chart" className="Chart">
           <button className="backBtn" onClick={props.handleGraphChange}>Go Back</button>
        </div>
    );
}

export default LineBarChart

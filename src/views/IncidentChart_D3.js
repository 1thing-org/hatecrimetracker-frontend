import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";

const IncidentChart_D3 = ({ chart_data, viewMode, showSelfReport }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!chart_data || chart_data.length === 0) return;

    const svgId = chartRef.current;
    d3.select(svgId).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(svgId)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Keys to stack
    const keys = ["news"];
    if (showSelfReport) keys.push("self_report");

    // Prepare data
    const stackedData = d3.stack().keys(keys)(chart_data);

    const x = d3
      .scaleBand()
      .domain(chart_data.map((d) => d.key))
      .range([0, width])
      .padding(0.6);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(chart_data, (d) => d.news + (viewMode === "monthly" ? d.self_report : 0)),
      ])
      .nice()
      .range([height, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#514f81", "#cc804d"]);

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((d) => dayjs(d).format("MM/YYYY"))
          .tickValues(x.domain().filter((d, i) => i % Math.ceil(chart_data.length / 8) === 0))
      )
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y).ticks(5));

    // Draw bars
    svg
      .selectAll("g.layer")
      .data(stackedData)
      .join("g")
      .attr("fill", d => {
        if (d.key === "news") return "#514f81";
        if (d.key === "self_report") return "#cc804d";
        return "#ccc";
        })
      .style("stroke", "none") 
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.key))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("shape-rendering", "geometricPrecision");;
      
  }, [chart_data, viewMode]);

  return <div ref={chartRef} id="chart_1yaxis" style={{ width: "100%" }} />;
};

export default IncidentChart_D3;

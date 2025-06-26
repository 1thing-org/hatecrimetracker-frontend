import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";
import { Card, CardBody, CardHeader } from 'reactstrap'
import "./IncidentChart_AM.css";

const IncidentChart_D3 = ({ chart_data, 
    viewMode, 
    setViewMode,
    showSelfReport,
    setSelfReport,
    state,
    isFirstLoadData }) => {
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
      .call((g) => g.selectAll(".tick line").remove()) 
      .selectAll("text")
      .attr("transform", "rotate(0)")
      .style("text-anchor", "center");


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
      
  }, [chart_data, viewMode, showSelfReport]);

  return (
    <Card>
        <CardHeader>
        </CardHeader>
        <CardBody>
        <div className="recharts-wrapper">
            {chart_data.length === 0 && !isFirstLoadData ? (
            <p className="add-data-button">
                No data collected in this range.
            </p>
            ) : null}
            <div ref={chartRef} id="chart_1yaxis" style={{ width: "100%" }} />
            <div className="time-range-toggle">
                <div
                    className="time-option"
                    onClick={() => setViewMode("monthly")}
                >
                    <div
                    className={`time-circle-outer ${
                    viewMode === "monthly" ? "active" : ""
                    }`}
                >
                    {viewMode === "monthly" && <div className="time-circle-inner" />}
                </div>
                    <span
                    className={
                    viewMode === "monthly" ? "active-label" : "inactive-label"
                    }
                >
                    Monthly
                </span>
                </div>
                <div
                className="time-option"
                onClick={() => setViewMode("daily")}
                >
                <div
                    className={`time-circle-outer ${
                    viewMode === "daily" ? "active" : ""
                    }`}
                >
                    {viewMode === "daily" && <div className="time-circle-inner" />}
                </div>
                <span
                    className={
                    viewMode === "daily" ? "active-label" : "inactive-label"
                    }
                >
                    Daily
                </span>
                </div>
            </div>
        </div>
    </CardBody>
    </Card>
  );
};

export default IncidentChart_D3;

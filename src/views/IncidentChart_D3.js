import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";
import { Card, CardBody, CardHeader } from 'reactstrap'
import { Trans } from "react-i18next";
import TimeToggle from "./components/time-toggle/TimeToggle";

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

    // Set chart demension
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Initialize svg
    const svg = d3
      .select(svgId)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select(chartRef.current)
      .append("div")
      .attr("id", "d3-tooltip")
      .style("position", "absolute")
      .style("background", viewMode === "daily" ? "#FEF753" : "#957DAD")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.3)")
      .style("display", "none");

    // Prepare stacked keys (currently self-report not showing)
    const keys = ["news"];
    if (showSelfReport) keys.push("self_report");

    const stackedData = d3.stack().keys(keys)(chart_data);

    // Set up x and y scales
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

    // color for each key
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
        if (d.key === "news") {
          return viewMode === "monthly" ? "#514f81" : "#FEF753";
        }
        if (d.key === "self_report") return "#cc804d";
        return "#ccc";
        })
      .style("stroke", "none") 
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.key))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => {
        const height = y(d[0]) - y(d[1]);
        return isNaN(height) ? 0 : height;
      }) 
      .attr("width", x.bandwidth())
      .attr("shape-rendering", "geometricPrecision")
      .on("mouseover", function (event, d) {
      tooltip
        .style("display", "block")
        .style("background", "#283046")
        .html(`
          <strong>${
            viewMode === "monthly"
              ? dayjs(d.data.key).format("MMM YYYY")
              : dayjs(d.data.key).format("YYYY-MM-DD")
          }</strong><br/>
          ${viewMode === "monthly" ? "Monthly" : "Daily"} Cases: ${d.data.news}
        `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.offsetX + 10 + "px")
          .style("top", event.offsetY - 30 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });;;
        
    }, [chart_data, viewMode, showSelfReport]);

  const totalCases = chart_data.reduce((sum, d) => sum + d.news + d.self_report, 0);
  const isAllZero = totalCases === 0;

  return (
    <Card>

        <CardBody>
        <div className="recharts-wrapper">
          {isAllZero && !isFirstLoadData ? (
          <>
            <p className="add-data-button">
              <Trans i18nKey="no_data_please_report">
                There is no data collected in the selected location and date
                range yet. Please click
                <a
                  href="https://forms.gle/HRkVKW2Sfp7BytXj8"
                  target="_blank"
                >
                  here
                </a>
                to report incidents to us.
              </Trans>
            </p>
            <div className="drop-down" />
          </>
        ) : null}
          <div ref={chartRef} id="chart_1yaxis" style={{ width: "100%" }} />
          <TimeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </CardBody>
    </Card>
  );
};

export default IncidentChart_D3;

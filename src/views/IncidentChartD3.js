import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";
import { Card, CardBody} from 'reactstrap'
import { Trans } from "react-i18next";
import TimeToggle from "./components/time-toggle/TimeToggle";

// Keys
const KEY_NEWS = "news";
const KEY_SELF_REPORT = "self_report";

// View modes
const VIEW_MODE_MONTHLY = "monthly";
const VIEW_MODE_DAILY = "daily";

// Colors
const COLOR_NEWS_MONTHLY = "#514f81";
const COLOR_NEWS_DAILY = "#FEF753";
const COLOR_SELF_REPORT = "#ffab91";
const COLOR_TOOLTIP_BG = "#283046";

const IncidentChartD3 = ({ 
    rawTimeSeriesData,
    initialViewMode = VIEW_MODE_MONTHLY,
    showSelfReport,
    state,
    isFirstLoadData 
}) => {
  const chartRef = useRef();
  const [viewMode, setViewMode] = useState(initialViewMode);

  // Data formatting
  const formatChartData = (rawData, viewMode) => {
    return rawData
      .filter((d, idx, arr) => {
        if (viewMode === VIEW_MODE_DAILY) return true;

        // Keep first entry for each month even if it's 0
        const currentMonth = dayjs(d.key).format("YYYY-MM");
        const isFirstInMonth = !arr.slice(0, idx).some(prev =>
          dayjs(prev.key).format("YYYY-MM") === currentMonth
        );

        return isFirstInMonth;
      })
      .map(d => ({
        key: d.key,
        [KEY_NEWS]: viewMode === VIEW_MODE_MONTHLY ? d.monthly_news : d.daily_news,
        [KEY_SELF_REPORT]: viewMode === VIEW_MODE_MONTHLY ? d.monthly_self_report : d.daily_self_report,
      }));
  };

  const chartData = formatChartData(rawTimeSeriesData || [], viewMode);
  const totalCases = chartData.reduce((sum, d) => sum + d[KEY_NEWS] + d[KEY_SELF_REPORT], 0);
  const isAllZero = totalCases === 0;

  useEffect(() => {
    const svgId = chartRef.current;
    d3.select(svgId).selectAll("*").remove();

    // Early return only for truly invalid data
    if (!chartData) return;

    // Set chart dimension
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
      .style("background", COLOR_TOOLTIP_BG)
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.3)")
      .style("display", "none");

    // Prepare stacked keys (by default self-report not showing)
    const keys = [KEY_NEWS];
    if (showSelfReport) keys.push(KEY_SELF_REPORT);
    const stackedData = d3.stack().keys(keys)(chartData);

    // Set up x and y scales
    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.key))
      .range([0, width])
      .padding(0.6);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(chartData, (d) => d[KEY_NEWS] + (viewMode === VIEW_MODE_MONTHLY ? d[KEY_SELF_REPORT] : 0)),
      ])
      .nice()
      .range([height, 0]);

    // color for each key
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range([COLOR_NEWS_MONTHLY, COLOR_SELF_REPORT]);

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((d) => dayjs(d).format("MM/YYYY"))
          .tickValues(x.domain().filter((d, i) => i % Math.ceil(chartData.length / 8) === 0))
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
        if (d.key === KEY_NEWS) {
          return viewMode === VIEW_MODE_MONTHLY ? COLOR_NEWS_MONTHLY : COLOR_NEWS_DAILY;
        }
        if (d.key === KEY_SELF_REPORT) return COLOR_SELF_REPORT;
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
        const dateStr = viewMode === VIEW_MODE_MONTHLY
          ? dayjs(d.data.key).format("MMM YYYY")
          : dayjs(d.data.key).format("YYYY-MM-DD");

        let html = `<strong>${dateStr}</strong><br/>`;
        html += `News Cases: ${d.data[KEY_NEWS]}`;

        if (showSelfReport && d.data[KEY_SELF_REPORT] !== undefined) {
          html += `<br/>Self-Report Cases: ${d.data[KEY_SELF_REPORT]}`;
        }

        tooltip
          .style("display", "block")
          .style("background", COLOR_TOOLTIP_BG)
          .html(html);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.offsetX + 10 + "px")
          .style("top", event.offsetY - 30 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });
        
    }, [chartData, viewMode, showSelfReport]);

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
          <TimeToggle viewMode={viewMode} setViewMode={setViewMode}
          />
      </div>
    </CardBody>
    </Card>
  );
};

export default IncidentChartD3;

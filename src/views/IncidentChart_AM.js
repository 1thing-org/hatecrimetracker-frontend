// import { ThemeColors } from "@src/utility/context/ThemeColors";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import "./IncidentChart_AM.css";
import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import { stateFullName } from "../utility/Utils";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { th } from "date-fns/locale";

am4core.useTheme(am4themes_animated);

/*
Example comes from here
https://www.amcharts.com/docs/v4/getting-started/integrations/using-react/
*/

//chartData is result from ___
const IncidentChart_AM = ({ color, chart_data, state, isFirstLoadData }) => {
  const { t } = useTranslation();
  const [totalCases, setTotalCases] = useState(0);
  const [viewMode, setViewMode] = useState("monthly");


  useLayoutEffect(() => {
    let total = 0;
    for (let i = 0; i < chart_data.length; i++) {
      total += chart_data[i].daily_cases || 0;  // Use daily_cases instead of value
    }
    setTotalCases(total);

    // Create chart instance
    let chart = am4core.create("chart_1yaxis", am4charts.XYChart);
    chart.logo.disabled = true;
    chart.data = chart_data;
    // Create date axes and value axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.stroke = "white";
    dateAxis.renderer.grid.template.strokeWidth = 1;
    dateAxis.renderer.grid.template.strokeOpacity = 0.2;
    dateAxis.renderer.grid.template.strokeDasharray = "3,3";
    dateAxis.dateFormats.setKey("day", "MM/yyyy");
    dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");
    dateAxis.dateFormats.setKey("week", "MM/yyyy");
    dateAxis.periodChangeDateFormats.setKey("week", "MM/yyyy");
    dateAxis.dateFormats.setKey("month", "MM/yyyy");
    dateAxis.periodChangeDateFormats.setKey("month", "MM/yyyy");
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Case Count";
    valueAxis.min = 0;
    valueAxis.title.fontWeight = 600;
    valueAxis.renderer.grid.template.stroke = "white";
    valueAxis.renderer.grid.template.strokeWidth = 1;
    valueAxis.renderer.grid.template.strokeOpacity = 0.2;
    valueAxis.renderer.grid.template.strokeDasharray = "3,3";

    // Create series (the data sets)
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "monthly_cases";
    series1.dataFields.dateX = "key";
    series1.name = "Monthly Cases";
    series1.tooltipText = `{key}
        [bold]Monthly Cases: {monthly_cases}`;
    series1.yAxis = valueAxis;
    series1.fillOpacity = 0.4;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "daily_cases";
    series2.dataFields.dateX = "key";
    series2.name = "Daily Cases";
    // series2.tooltipText = toolTipText;
    series2.columns.template.tooltipText = `{key}
        [bold]Daily Cases: {daily_cases}`;
    chart.tooltip.label.fill = am4core.color("#f00");
    series2.clustered = true;
    series2.fill = am4core.color(color);
    series2.stroke = am4core.color(color);
    series2.columns.template.width = am4core.percent(80);

    // Show and hide based on viewMode
    series1.hidden = viewMode !== "monthly";
    series2.hidden = viewMode !== "daily";

    // chart cursor on
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = false;
    chart.cursor.lineY.disabled = false;

    return () => {
      chart.dispose();
    };
  }, [chart_data, viewMode]);

  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <CardTitle tag="h4">
              {t("incident_chart.trend")}&nbsp;-&nbsp;
              {totalCases > 0
                ? t("incident_chart.total_cases", { count: totalCases })
                : t("incident_chart.no_data")}
              {state ? " : " + stateFullName(state) : ""}
            </CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          <div className="recharts-wrapper">
            {totalCases === 0 && !isFirstLoadData ? (
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
            <div
              id="chart_1yaxis"
              style={{ width: "100%", height: "400px" }}
            ></div>
            </div>
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
        </CardBody>
      </Card>
    </div>
  );
};

export default IncidentChart_AM;

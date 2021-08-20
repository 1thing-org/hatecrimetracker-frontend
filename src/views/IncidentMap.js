import { ThemeColors } from '@src/utility/context/ThemeColors'
import am4geodata_usaHigh from "@amcharts/amcharts4-geodata/usaHigh";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react';
import {getStateIncidentPerM, formatIncidentRate, stateFullName, forEachState} from '../utility/Utils';
am4core.useTheme(am4themes_animated);

/*

Example comes from here
https://www.amcharts.com/docs/v4/getting-started/integrations/using-react/

*/

//mapData is result from api/stats.total
const IncidentMap = (props) => {
  const [mapPolygonSeries, setMapPolygonSeries] = useState();
  const [polygonTemplate, setPolygonTemplate] = useState();
  const [selectedState, setSelectedState] = useState();

  const updateMap = (mapStatistics) => {
    if (!mapPolygonSeries) return;
    let data = [];
    forEachState( (state, name) => {
      const count = mapStatistics[state]?mapStatistics[state] : null;
      data.push({
        id: "US-" + state,
        value: count,
        tooltipText: "<div class='maptooltip'><span class='state'>" + name + "</span><br/>"
          + "<div class='casenumber'>Case Number: " + (count?count:0) + "<br/>"
          + "Count/1MM: " + (count?formatIncidentRate(getStateIncidentPerM( count, state)):0)
          + "</div></div>"
      })
    })
    mapPolygonSeries.data = data;
    selectState(selectedState);
  }
  useEffect(() => {
    updateMap(props.mapData);
  }, [props.mapData]);

  useEffect(() => {
    setSelectedState(props.selectdState);
  }, [props.selectdState]);

  useEffect(() => {
    selectState(selectedState);
  }, [selectedState]);

  const { colors } = useContext(ThemeColors)
  const selectState = (state) => {
    if (!mapPolygonSeries || !polygonTemplate) {
      return;
    }
    const stateId = "US-" + state;
    //clean selection effect on other states
    for (let i = 0; i < mapPolygonSeries.mapPolygons.values.length; i++) {
      const polygon = mapPolygonSeries.mapPolygons.values[i];
      if (stateId == polygon.dataItem?.dataContext?.id) {
        //https://www.amcharts.com/docs/v4/tutorials/consistent-outlines-of-map-polygons-on-hover/
        polygon.zIndex = Number.MAX_VALUE;
        polygon.toFront();
        polygon.strokeWidth = 4;
        polygon.stroke = am4core.color("#FCEB4F") //am4core.color(colors.danger.main);
        var activeShadow = polygon.filters.push(new am4core.DropShadowFilter);
        activeShadow.dx = 6;
        activeShadow.dy = 6;
        activeShadow.opacity = 0.3;
      }
      else {
        polygon.strokeWidth = polygonTemplate.strokeWidth;
        polygon.stroke = polygonTemplate.stroke;
        polygon.zIndex = i;
        polygon.filters.clear();
      }
    }
  }
  //componentDidMount
  useLayoutEffect(() => {
    let map = am4core.create("chartdiv", am4maps.MapChart);
    map.geodata = am4geodata_usaHigh;
    map.projection = new am4maps.projections.AlbersUsa();
    map.chartContainer.wheelable = false;
    map.seriesContainer.draggable = false;
    map.seriesContainer.resizable = false;
    map.maxZoomLevel = .5;
    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: am4core.color("olive"), //minimal color
      max: am4core.color("yellow"),
    });
    // let heatLegend = map.createChild(am4maps.HeatLegend);
    // heatLegend.series = polygonSeries;
    // heatLegend.align = "right";
    // heatLegend.width = am4core.percent(10);
    // heatLegend.marginRight = am4core.percent(4);
    // // heatLegend.minValue = 0;
    // // heatLegend.maxValue = 20;
    // heatLegend.valign = "bottom";
    // // heatLegend.orientation = "vertical";
    polygonSeries.data = [];
    polygonSeries.tooltip.getFillFromObject = false;
    polygonSeries.tooltip.background.fill = am4core.color("#000000");
    polygonSeries.tooltip.getStrokeFromObject = false;
    polygonSeries.tooltip.stroke = am4core.color("#FEF753");
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML = "{tooltipText}";
    polygonTemplate.fill = am4core.color("#AAAAAA");
    polygonTemplate.fillOpacity = 1;
    polygonTemplate.clickable = true;
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fillOpacity = 0.5;

    polygonTemplate.events.on("hit", function (ev) {
      let newState = null;
      if (ev.target?.dataItem?.dataContext?.id) {
        newState = ev.target.dataItem.dataContext.id.split("-")[1];
      }
      if (newState != props.selectdState) {
        props.onChange(newState);
      }
    });

    polygonTemplate.stroke = am4core.color("#6979C9");
    polygonTemplate.strokeOpacity = 1;
    setMapPolygonSeries(polygonSeries);
    setPolygonTemplate(polygonTemplate);
    return () => {
      map.dispose();
    };
  }, []);
  return (<Card>
    <CardHeader>
      <div>
        <CardTitle tag='h4'>Hate Crime Map</CardTitle>
      </div>
    </CardHeader>
    <CardBody>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </CardBody>
  </Card>);

}

export default IncidentMap

import am4geodata_usaHigh from "@amcharts/amcharts4-geodata/usaHigh";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { SelectionState } from "draft-js";
import React, { useEffect, useLayoutEffect, useState } from 'react';

am4core.useTheme(am4themes_animated);

/*

Example comes from here
https://www.amcharts.com/docs/v4/getting-started/integrations/using-react/

*/

//mapData is result from api/stats.total
const IncidentMap = (props) => {
  console.log("init IncidentMap"  );
  const [mapState, setMapState] = useState();
  // const [mapPolygonSeries, setMapStatePolygonSeries] = useState();
  // const [mapPolygonTemplate, setMapStatePolygonTemplate] = useState();
  // const [currentActiveState, setCurrentActiveState] = useState();
  // const [currentActiveStateZIndex, setCurrentActiveStateZIndex] = useState();

  const updateMap = (mapStatistics) => {
    if (!mapState || !mapState.mapPolygonSeries) return;
    let data = [];
    for (const state in mapStatistics) {
      data.push({
        id: "US-" + state,
        value: mapStatistics[state]
      })
    }
    mapState.mapPolygonSeries.data = data;
  }
  useEffect(() => {
    updateMap(props.mapData);
  }, [props.mapData]);

  useEffect(() => {
    if (!mapState || !mapState.mapPolygonSeries || !mapState.mapPolygonTemplate) return;
    const polygon = mapState.mapPolygonSeries.getPolygonById("US-" + props.selectdState);
    selectState(polygon);
  }, [props.selectdState]);

  const selectState = (stateMapObject) => {
    // if (currentActiveState == stateMapObject)
    //   return;
    // if (currentActiveState) { //clear the previousely selected state
    //   currentActiveState.zIndex = currentActiveStateZIndex;
    //   currentActiveState.strokeWidth = mapPolygonTemplate.strokeWidth;
    //   currentActiveState.stroke = mapPolygonTemplate.stroke;
    //   currentActiveState.filters.clear();
    // }
    if (mapState.mapPolygonSeries) {
      for ( let i=0; i< mapState.mapPolygonSeries.mapPolygons.length; i++) {
        const polygon = mapState.mapPolygonSeries.mapPolygons[i];
        polygon.strokeWidth = mapState.mapPolygonTemplate.strokeWidth;
        polygon.stroke = mapState.mapPolygonTemplate.stroke;
        polygon.filters.clear();
      }
    }

    //https://www.amcharts.com/docs/v4/tutorials/consistent-outlines-of-map-polygons-on-hover/

    
    if (stateMapObject) {
      //setCurrentActiveStateZIndex(stateMapObject.zIndex);
      mapState.currentActiveStateZIndex = stateMapObject.zIndex
      stateMapObject.zIndex = Number.MAX_VALUE;
      stateMapObject.toFront();
      stateMapObject.strokeWidth = 3;
      stateMapObject.stroke = am4core.color("#FCEB4F");
      var activeShadow = stateMapObject.filters.push(new am4core.DropShadowFilter);
      activeShadow.dx = 6;
      activeShadow.dy = 6;
      activeShadow.opacity = 0.3;
    }
    mapState.currentActiveState = stateMapObject;
    setMapState(mapState);
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
      min: am4core.color("#9F833B"), //minimal color
      max: am4core.color("#FCEB4F"),
    });
    let heatLegend = map.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = "right";
    heatLegend.width = am4core.percent(10);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 10;
    heatLegend.valign = "bottom";
    heatLegend.orientation = "vertical";
    polygonSeries.data = [];
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML =
      "<strong>{name}:<strong> {value}";
    polygonTemplate.fill = am4core.color("#AAAAAA");
    polygonTemplate.fillOpacity = 1;
    polygonTemplate.clickable = true;
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fillOpacity = 0.5;

    polygonTemplate.events.on("hit", function (ev) {
      if (!mapState || mapState.currentActiveState == ev.target) return;
      selectState(ev.target);
      if (ev.target && ev.target.id) {
        props.onChange(ev.target.id.split("-")[1]);
      }
    });

    polygonTemplate.stroke = am4core.color("#6979C9");
    polygonTemplate.strokeOpacity = 1;

    setMapState({
      mapPolygonSeries: polygonSeries,
      mapPolygonTemplate: polygonTemplate
    });
    // setMapPolygonTemplate(polygonTemplate);
    return () => {
      map.dispose();
    };
  }, []);
  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
}

export default IncidentMap

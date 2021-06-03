<template>
  <div>
    <div class="map" ref="map">

    </div>
    <div class="stats">
      <p class="h3 m-0">
      <span class="mr-xs fw-normal">Total Incidents: 12345</span>
      </p>
    </div>
  </div>

</template>

<script>
import AnimatedNumber from "animated-number-vue";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_usaHigh from "@amcharts/amcharts4-geodata/usaHigh";

export default {
  name: 'Map',
  components: { AnimatedNumber },
  data() {
    return {
      // animateNumberOptions: {
      //   duration: 2000,
      //   easing: 'easeInQuad',
      //   formatValue(value) {
      //     let number = value.toFixed(0);
      //     let numberAsArrayWithSapces = [];
      //     while (number >= 1) {
      //       numberAsArrayWithSapces.unshift(number % 1000);
      //       number = (number/1000).toFixed();
      //     }
      //     return numberAsArrayWithSapces.join(' ');
      //   }
      // }
    }
  },
  mounted() {
    let map = am4core.create(this.$refs.map, am4maps.MapChart);
    map.geodata = am4geodata_usaHigh;
    map.projection = new am4maps.projections.AlbersUsa();
    map.chartContainer.wheelable = false;
    map.seriesContainer.draggable = false;
    map.seriesContainer.resizable = false;

    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    debugger
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: am4core.color("#ffffff"), //minimal color
      max: am4core.color("#ff0000")
    });

    let heatLegend = map.createChild(am4maps.HeatLegend);
  heatLegend.series = polygonSeries;
  heatLegend.align = "right";
  heatLegend.width = am4core.percent(25);
  heatLegend.marginRight = am4core.percent(4);
  heatLegend.minValue = 0;
  heatLegend.maxValue = 100;
  heatLegend.valign = "bottom";
    polygonSeries.data = [
      {
        id: "US-AL",
        value: 5
      },
      {
        id: "US-CA",
        value: 50
      },
      {
        id: "US-NJ",
        value: 20
      },
      {
        id: "US-NY",
        value: 90
      },
    ];


    map.homeZoomLevel = 1.2;

    map.zoomControl = new am4maps.ZoomControl();
    map.zoomControl.align = 'left';
    map.zoomControl.valign = 'bottom';
    map.zoomControl.dy = -20;

    map.zoomControl.minusButton.background.fill = am4core.color("#C7D0FF");
    map.zoomControl.minusButton.background.fillOpacity = 0.24;
    map.zoomControl.minusButton.background.stroke = null;
    map.zoomControl.plusButton.background.fill = am4core.color("#C7D0FF");
    map.zoomControl.plusButton.background.fillOpacity = 0.24;
    map.zoomControl.plusButton.background.stroke = null;
    map.zoomControl.plusButton.label.fill = am4core.color("#fff");
    map.zoomControl.plusButton.label.fontWeight = 600;
    map.zoomControl.plusButton.label.fontSize = 16;
    map.zoomControl.minusButton.label.fill = am4core.color("#fff");
    map.zoomControl.minusButton.label.fontWeight = 600;
    map.zoomControl.minusButton.label.fontSize = 16;
    let plusButtonHoverState = map.zoomControl.plusButton.background.states.create("hover");
    plusButtonHoverState.properties.fillOpacity = 0.24;
    let minusButtonHoverState = map.zoomControl.minusButton.background.states.create("hover");
    minusButtonHoverState.properties.fillOpacity = 0.24;

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML = "<strong>{name}<strong><p>many many cases:{value}!</p>";
    polygonTemplate.fill = am4core.color("#474D84");
    polygonTemplate.fillOpacity = 1;
    polygonTemplate.clickable = true;
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fillOpacity = 0.5;

    polygonTemplate.stroke = am4core.color("#6979C9");
    polygonTemplate.strokeOpacity = 1;

    this.map = map;
  },
};
</script>

<style src="./Map.scss" lang="scss" />

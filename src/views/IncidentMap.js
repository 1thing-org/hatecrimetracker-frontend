import { ThemeColors } from '@src/utility/context/ThemeColors'
import am4geodata_usaHigh from '@amcharts/amcharts4-geodata/usaHigh'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react'
import { getStateIncidentPerM, formatIncidentRate, forEachState, getStateIncidentPer10kAsian } from '../utility/Utils'
import { useTranslation } from 'react-i18next';

am4core.useTheme(am4themes_animated)

/*

Example comes from here
https://www.amcharts.com/docs/v4/getting-started/integrations/using-react/

*/

//mapData is result from api/stats.total
const IncidentMap = (props) => {
    const { t } = useTranslation();
    const [mapPolygonSeries, setMapPolygonSeries] = useState()
    const [polygonTemplate, setPolygonTemplate] = useState()
    const [selectedState, setSelectedState] = useState()
    const [maxValue, setMaxValue] = useState(0)
    const [showPer10KAsian, setShowPer10KAsian] = useState(props.showPer10KAsian)

    
    // const MAP_COLORS = [
    //     [.75, "#FFF500"], //when > , color
    //     [.5, "#D7CF00"],
    //     [.25, "#A9A403"],
    //     [.00001, "#706C00"],
    //     [0, "#313131"],
    // ];
    const MAP_COLOR_COUNT = [
        [10, "#FFF500"], //when >= , color        
        [5, "#D7CF00"],
        [2, "#A9A403"],
        [1, "#706C00"],
        [0, "#313131"],
    ];
    const MAP_COLOR_RATE = [
        [0.5, "#FFF500"], //when >= , color        
        [0.1, "#D7CF00"],
        [0.06, "#A9A403"],
        [0.01, "#706C00"],
        [0, "#313131"],
    ];
    const getMapColor = (value) => {
        if ( value ) {
            const colors = props.showPer10KAsian ? MAP_COLOR_RATE:MAP_COLOR_COUNT
            for ( const i in colors ) {
                if (value >= colors[i][0]) {
                    return colors[i][1];
                }    
            }
        }
        return "#313131";
    }
    

    const updateMap = (mapStatistics) => {
        if (!mapPolygonSeries) return
        
        //calc max value from the input map data
        let max = 0
        Object.values(mapStatistics).forEach((value) => max = value > max ? value : max);
        setMaxValue(max);
        let data = []
        forEachState((state, name) => {
            const count = mapStatistics[state];
            const value = !mapStatistics[state] ? 
                null :
                    (!props.showPer10KAsian ? mapStatistics[state] 
                        : getStateIncidentPer10kAsian(mapStatistics[state], state)
                    )

            data.push({
                id: 'US-' + state,
                value: value,
                tooltipText:
                    "<div class='maptooltip'><span class='state'>" + name + "</span><br/>" +
                    (count ? 
                        "<div class='casenumber'>" + 
                        "<table><tr><td>" + t("incident_map.cases") + ":</td><td width='70px' align='right'>" + count + "</td></tr>" + 
                        "<tr><td>"+t("incident_map.count_1mm") + ":</td><td align='right'>" + formatIncidentRate(getStateIncidentPerM(count, state)) + "</td></tr>" +
                        "<tr><td>"+t("incident_map.count_10k_asian") + ":</td><td align='right'>" + formatIncidentRate(getStateIncidentPer10kAsian(count, state)) + "</td></tr>" +
                        "</table>"
                    : "<br/>" + t("incident_map.no_data"))
                    + "</div></div>"
            })
        })
        mapPolygonSeries.data = data
        selectState(selectedState)
    }
    useEffect(() => {
        setShowPer10KAsian(props.showPer10KAsian);
        updateMap(props.mapData)
    }, [props.mapData, props.lang, props.showPer10KAsian])

    useEffect(() => {
        setSelectedState(props.selectdState)
    }, [props.selectdState])

    useEffect(() => {
        selectState(selectedState)
    }, [selectedState])

    const { colors } = useContext(ThemeColors)
    const selectState = (state) => {
        if (!mapPolygonSeries || !polygonTemplate) {
            return
        }
        const stateId = 'US-' + state
        //clean selection effect on other states
        for (let i = 0; i < mapPolygonSeries.mapPolygons.values.length; i++) {
            const polygon = mapPolygonSeries.mapPolygons.values[i]
            if (stateId == polygon.dataItem?.dataContext?.id) {
                //https://www.amcharts.com/docs/v4/tutorials/consistent-outlines-of-map-polygons-on-hover/
                polygon.zIndex = Number.MAX_VALUE
                polygon.toFront()
                polygon.strokeWidth = 4
                polygon.stroke = am4core.color('#FCEB4F') //am4core.color(colors.danger.main);
                var activeShadow = polygon.filters.push(new am4core.DropShadowFilter())
                activeShadow.dx = 6
                activeShadow.dy = 6
                activeShadow.opacity = 0.3
            } else {
                polygon.strokeWidth = polygonTemplate.strokeWidth
                polygon.stroke = polygonTemplate.stroke
                polygon.zIndex = i
                polygon.filters.clear()
            }
        }
    }
    //componentDidMount
    useLayoutEffect(() => {
        let map = am4core.create('chartdiv', am4maps.MapChart)
        map.geodata = am4geodata_usaHigh
        map.projection = new am4maps.projections.AlbersUsa()
        map.chartContainer.wheelable = false
        map.seriesContainer.draggable = false
        map.seriesContainer.resizable = false
        map.maxZoomLevel = 0.5
        map.cursorOverStyle = am4core.MouseCursorStyle.pointer

        let polygonSeries = map.series.push(new am4maps.MapPolygonSeries())

let legend = new am4maps.Legend();
legend.parent = map.chartContainer;
let markerTemplate = legend.markers.template;
markerTemplate.width = 12;
markerTemplate.height = 12;
let marker = legend.markers.template.children.getIndex(0);
marker.cornerRadius(0, 0, 0, 0);

let legendLabel = legend.createChild(am4core.Label);
legendLabel.text = "Incident Count";
legendLabel.fontSize = "10px";

legend.background.fill = am4core.color("#000");
legend.background.fillOpacity = 0.05;
legend.fontSize =  "10px";
legend.width = 100;
legend.valign = "middle";
legend.align = "left";
// legend.position = "left";
legend.data = [{
  "name": ">= 10",
  "fill":"#FFF500"
}, {
  "name": "5-10",
  "fill": "#D7CF00"
}, {
  "name": "2-5",
  "fill": "#A9A403"
},
{
    "name": "1",
    "fill": "#706C00"
},
{
    "name": "0",
    "fill": "#313131"
}

];

/*
[10, "#FFF500"], //when >= , color        
        [5, "#D7CF00"],
        [2, "#A9A403"],
        [1, "#706C00"],
        [0, "#313131"],*/
// let legendLabel = legend.createChild(am4core.Label);
// legendLabel.text = "Count/10K Asian";

// // Create a container child
// let colors = new am4core.ColorSet();
// for (let i = 0; i < 6; i++) {
//   let rect = legend.createChild(am4core.Rectangle);
//   rect.width = am4core.percent(100);
//   rect.height = am4core.percent(100);
//   rect.fill = colors.next();
//   rect.fillOpacity = 0.8;
// }

// circle.toFront();

        polygonSeries.useGeodata = true
        polygonSeries.data = []
        polygonSeries.tooltip.getFillFromObject = false
        polygonSeries.tooltip.background.fill = am4core.color('#000000')
        polygonSeries.tooltip.getStrokeFromObject = false
        polygonSeries.tooltip.stroke = am4core.color('#FEF753')
        let polygonTemplate = polygonSeries.mapPolygons.template
        polygonTemplate.tooltipHTML = '{tooltipText}'
        // polygonTemplate.fillOpacity = 0.5;
        polygonTemplate.adapter.add("fill", function (fill, target) {
            return am4core.color(getMapColor(target.dataItem.value));
            // const colors = props.showPer10KAsian?MAP_COLOR_RATE:MAP_COLOR_COUNT;
            // for ( const i in colors ) {
            //     if (target.dataItem.value >= colors[i][0]) {
            //         return am4core.color(colors[i][1]);
            //     }    
            // }
            // return am4core.color("#313131");
        })
        polygonTemplate.fillOpacity = 1
        polygonTemplate.clickable = true
        let hs = polygonTemplate.states.create('hover')
        hs.properties.fillOpacity = 0.5

        polygonTemplate.events.on('hit', function (ev) {
            let newState = null
            if (ev.target?.dataItem?.dataContext?.id) {
                newState = ev.target.dataItem.dataContext.id.split('-')[1]
            }
            if (newState != props.selectdState) {
                props.onChange(newState)
            }
        })

        polygonTemplate.stroke = am4core.color('#D1CFD7')
        polygonTemplate.strokeOpacity = 1
        setMapPolygonSeries(polygonSeries)
        setPolygonTemplate(polygonTemplate)

        return () => {
            map.dispose()
        }
    }, [])
    return (
        <Card>
            <CardHeader>
            </CardHeader>
            <CardBody>
                <div id='chartdiv' className='incident-map-container' style={{align:"center"}}></div>
            </CardBody>
        </Card>
    )
}

export default IncidentMap

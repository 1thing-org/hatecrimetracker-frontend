import am4geodata_usaHigh from '@amcharts/amcharts4-geodata/usaHigh'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { Card, CardBody, CardHeader } from 'reactstrap'
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react'
import { getStateIncidentPerM, formatIncidentRate, forEachState, getStateIncidentPer10kAsian } from '../utility/Utils'
import { useTranslation } from 'react-i18next';
import './IncidentMap.css'
am4core.useTheme(am4themes_animated)

/*

Example comes from here
https://www.amcharts.com/docs/v4/getting-started/integrations/using-react/

*/

let global_props;
//mapData is result from api/stats.total
const IncidentMap = (props) => {
    global_props = props;
    const { t } = useTranslation();
    const [mapPolygonSeries, setMapPolygonSeries] = useState()
    const [mapLegend, setMapLegend] = useState()
    const [mobileLegend, setMobileLegend] = useState()
    const [polygonTemplate, setPolygonTemplate] = useState()
    const [selectedState, setSelectedState] = useState()
    const [maxValue, setMaxValue] = useState(0)



    const MAP_COLOR_COUNT = [
        [10, "#FFF500"], //when >= , color        
        [5, "#908B09"],
        [2, "#AEAEAE"],
        [1, "#5C5C5C"],
        [0, "#000000"],
    ];
    const MAP_COLOR_RATE = [
        [0.5, "#FFF500"], //when >= , color        
        [0.1, "#908B09"],
        [0.06, "#AEAEAE"],
        [0.01, "#5C5C5C"],
        [0, "#000000"],
    ];
    const getMapColor = (value) => {
        if (value) {
            const colors = props.showPer10KAsian ? MAP_COLOR_RATE : MAP_COLOR_COUNT
            for (const i in colors) {
                if (value >= colors[i][0]) {
                    return colors[i][1];
                }
            }
        }
        return "#000000";
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

            const isSelected = selectedState === state;
            data.push({
                id: 'US-' + state,
                value: value,
                fillColor: getMapColor(value),
                // Selection styling
                strokeColor: isSelected ? '#FCEB4F' : '#D1CFD7',
                strokeWidth: isSelected ? 4 : 1,
                strokeOpacity: 1,
                tooltipText:
                    "<div class='maptooltip'><span class='state'>" + name + "</span><br/>" +
                    (count ?
                        "<div class='casenumber'>" +
                        "<table><tr><td>" + t("incident_map.cases") + ":</td><td width='70px' align='right'>" + count + "</td></tr>" +
                        "<tr><td>" + t("incident_map.count_1mm") + ":</td><td align='right'>" + formatIncidentRate(getStateIncidentPerM(count, state)) + "</td></tr>" +
                        "<tr><td>" + t("incident_map.count_10k_asian") + ":</td><td align='right'>" + formatIncidentRate(getStateIncidentPer10kAsian(count, state)) + "</td></tr>" +
                        "</table>"
                        : "<br/>" + t("incident_map.no_data"))
                    + "</div></div>"
            })
        })
        mapPolygonSeries.data = data
    }
    useEffect(() => {
        updateMap(props.mapData)
        updateMapLegend(mapLegend);
        updateMobileLegend(mobileLegend);
    }, [props.mapData, props.lang, props.showPer10KAsian, mapLegend, mobileLegend])

    useEffect(() => {
        setSelectedState(props.selectedState)
    }, [props.selectedState])

    useEffect(() => {
        // Trigger map update when selectedState changes to refresh selection
        if (mapPolygonSeries && Object.keys(props.mapData).length > 0) {
            updateMap(props.mapData)
        }
    }, [selectedState])

    // Update legends when they're first created
    useEffect(() => {
        updateMapLegend(mapLegend);
        updateMobileLegend(mobileLegend);
    }, [mapLegend, mobileLegend])

    // NOTE:
    // Previously it updated mapPolygonSeries.data and manually applied highlight styles
    // by looping over polygons in selectState(). However, since amCharts rebuilds polygons
    // asynchronously when data changes, highlights could disappear if selectState()
    // ran before polygons were ready.
    // Now selection styling is data-driven using propertyFields, so highlights update
    // automatically when data changes. This avoids timing issues and simplifies the code.
    // const selectState = (state) => {
        // Previous manual implementation removed:
    // }

    // Helper function to generate legend data from color constants
    const generateLegendData = (colorMap) => {
    return colorMap.map((item, index) => {
        const [threshold, color] = item;
        const nextThreshold = index < colorMap.length - 1 ? colorMap[index + 1][0] : null;
        
        let name;
        if (threshold === 0) {
            name = "0";
        } else if (nextThreshold === null) {
            name = `>= ${threshold}`;
        } else if (threshold === nextThreshold + 0.01) {
            name = `${threshold}`;
        } else {
            name = `${nextThreshold}-${threshold}`;
        }
        return {
            name,
            fill: color
        };
    });
};

    const updateMapLegend = (legend) => {
        if (!legend) return;
        legend.disposeChildren()
        let markerTemplate = legend.markers.template;
        markerTemplate.width = 17;
        markerTemplate.height = 17;

        legend.itemContainers.template.clickable = false;
        legend.itemContainers.template.focusable = false;
        legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;

        let marker = legend.markers.template.children.getIndex(0);
        marker.cornerRadius(0, 0, 0, 0);
        marker.stroke = am4core.color("#FFFFFF");
        markerTemplate.strokeWidth = 0.8;
        marker.strokeOpacity = 1;

        let legendLabel = legend.createChild(am4core.Label);
        legendLabel.fontSize = "13px";

        legend.background.fill = am4core.color("#000");
        legend.background.fillOpacity = 0.05;
        legend.fontSize = "12px";
        
        // Desktop: vertical layout, left aligned
        legend.layout = "vertical"
        legend.width = 120;
        legend.valign = "middle";
        legend.align = "left";
        
        legendLabel.clickable = false;
        legendLabel.focusable = false;
        legendLabel.cursorOverStyle = am4core.MouseCursorStyle.default;
        // legend.position = "left";
        const colorMap = props.showPer10KAsian ? MAP_COLOR_RATE : MAP_COLOR_COUNT;
        legendLabel.text = props.showPer10KAsian ? 
            t("incident_map.count_10k_asian") : 
            t("incident_map.incident_count");
        
        legend.data = generateLegendData(colorMap);
        };

    const updateMobileLegend = (legend) => {
        if (!legend) return;
        legend.disposeChildren()
        let markerTemplate = legend.markers.template;
        markerTemplate.width = 12;
        markerTemplate.height = 12;

        legend.itemContainers.template.clickable = false;
        legend.itemContainers.template.focusable = false;
        legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;

        let marker = legend.markers.template.children.getIndex(0);
        marker.cornerRadius(0, 0, 0, 0);
        marker.stroke = am4core.color("#FFFFFF");
        markerTemplate.strokeWidth = 0.8;
        marker.strokeOpacity = 1;

        let legendLabel = legend.createChild(am4core.Label);
        legendLabel.fontSize = "12px";

        legend.background.fill = am4core.color("#000");
        legend.background.fillOpacity = 0.05;
        legend.fontSize = "12px";
        
        // Mobile: horizontal layout, inline with title
        legend.layout = "horizontal"
        legend.align = "center"
        legend.valign = "middle"
        legend.width = am4core.percent(100)
        legend.position = "relative"

        legend.itemContainers.template.layout = "vertical"
        legend.itemContainers.template.align = "center"
        legend.itemContainers.template.valign = "middle"
        legend.itemContainers.template.marginRight = 6

        legend.markers.template.align = "center"
        legend.labels.template.align = "center"
        legend.labels.template.valign = "top"
        legend.labels.template.paddingTop = 8
        
        // Align legend label at same level as squares
        legendLabel.valign = "top";
        legendLabel.align = "left";
        legendLabel.marginTop = 8;
        legendLabel.marginRight = 6;
        legendLabel.clickable = false;
        legendLabel.focusable = false;
        legendLabel.cursorOverStyle = am4core.MouseCursorStyle.default;

        const colorMap = props.showPer10KAsian ? MAP_COLOR_RATE : MAP_COLOR_COUNT;
        legendLabel.text = props.showPer10KAsian ? 
            t("incident_map.count_10k_asian") : 
            t("incident_map.incident_count");
        
        legend.data = generateLegendData(colorMap);
    };
    //componentDidMount
    useLayoutEffect(() => {
        let map = am4core.create('chartdiv', am4maps.MapChart)
        map.logo.disabled = true;
        map.geodata = am4geodata_usaHigh
        map.projection = new am4maps.projections.AlbersUsa()
        map.chartContainer.wheelable = false
        map.seriesContainer.draggable = false
        map.seriesContainer.resizable = false
        map.maxZoomLevel = 0.5
        map.cursorOverStyle = am4core.MouseCursorStyle.pointer

        let polygonSeries = map.series.push(new am4maps.MapPolygonSeries())

        // Desktop legend (vertical)
        let legend = new am4maps.Legend();
        let legendContainer = am4core.create("map-legend-container", am4core.Container);
        legendContainer.logo.disabled = true;
        legendContainer.layout = "vertical";
        legendContainer.padding(0, 0, 0, 0);
        legendContainer.width = am4core.percent(100);
        legendContainer.background.fillOpacity = 0;
        legend.parent = legendContainer;
        setMapLegend(legend)

        // Mobile legend (horizontal)
        let mLegend = new am4maps.Legend();
        let mLegendContainer = am4core.create("map-legend-mobile", am4core.Container);
        mLegendContainer.logo.disabled = true;
        mLegendContainer.layout = "horizontal";
        mLegendContainer.padding(0, 0, 0, 0);
        mLegendContainer.width = am4core.percent(100);
        mLegendContainer.background.fillOpacity = 0;
        mLegend.parent = mLegendContainer;
        setMobileLegend(mLegend)

        updateMapLegend(legend);
        updateMobileLegend(mLegend);

        polygonSeries.useGeodata = true
        polygonSeries.data = []
        polygonSeries.tooltip.getFillFromObject = false
        polygonSeries.tooltip.background.fill = am4core.color('#000000')
        polygonSeries.tooltip.getStrokeFromObject = false
        polygonSeries.tooltip.stroke = am4core.color('#FEF753')
        let polygonTemplate = polygonSeries.mapPolygons.template
        polygonTemplate.tooltipHTML = '{tooltipText}'
        polygonTemplate.fillOpacity = 1
        polygonTemplate.propertyFields.fill = "fillColor";
        // Use property fields for selection styling
        polygonTemplate.propertyFields.stroke = "strokeColor";
        polygonTemplate.propertyFields.strokeWidth = "strokeWidth";
        polygonTemplate.propertyFields.strokeOpacity = "strokeOpacity";
        polygonTemplate.clickable = true
        let hs = polygonTemplate.states.create('hover')
        hs.properties.fillOpacity = 0.5

        polygonTemplate.events.on('hit', function (ev) {
            let newState = null
            if (ev.target?.dataItem?.dataContext?.id) {
                newState = ev.target.dataItem.dataContext.id.split('-')[1]
            }
            // if (newState != props.selectedState) {
            if ( global_props && global_props.stateToggled) {   
                global_props.stateToggled(newState)
            }
            // }
        })

        // Default stroke values - now handled by propertyFields
        polygonTemplate.stroke = am4core.color('#D1CFD7')
        polygonTemplate.strokeOpacity = 1
        
        setMapPolygonSeries(polygonSeries)
        setPolygonTemplate(polygonTemplate)

        return () => {
            map.dispose()
            // Also dispose the legend containers to prevent conflicts
            if (legendContainer) {
                legendContainer.dispose()
            }
            if (mLegendContainer) {
                mLegendContainer.dispose()
            }
        }
    }, [])
    return (
        <Card>
            <CardHeader>
            </CardHeader>
            <CardBody>
                <div id='' className='incident-map'>
                    <div id='chartdiv' style={{ width: '100%', height: '100%' }}>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default IncidentMap

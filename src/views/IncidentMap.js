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

    const updateMap = (mapStatistics) => {
        if (!mapPolygonSeries) return
        let data = []
        forEachState((state, name) => {
            const count = mapStatistics[state] ? mapStatistics[state] : null
            data.push({
                id: 'US-' + state,
                value: count,
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
        updateMap(props.mapData)
    }, [props.mapData, props.lang])

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

            if (target.dataItem.value > 10) {
                return am4core.color("#FFF500");
            }
            if (target.dataItem.value > 5) {
                return am4core.color("#D7CF00");
            }
            if (target.dataItem.value > 2) {
                return am4core.color("#A9A403");
            }
            if (target.dataItem.value > 0) {
                return am4core.color("#706C00");
            }
            return am4core.color("#313131");
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
                <div id='chartdiv' style={{ width: '100%', height: '400px' }}></div>
            </CardBody>
        </Card>
    )
}

export default IncidentMap

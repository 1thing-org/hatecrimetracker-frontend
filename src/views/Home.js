import { ThemeColors } from '@src/utility/context/ThemeColors'
import '@styles/react/libs/charts/recharts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { useContext, useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Container, CardTitle, Col, Row, FormGroup, Label } from 'reactstrap'
import DateRangeSelector from './DateRangeSelector'
import 'rsuite/dist/styles/rsuite-dark.css'
import * as incidentsService from '../services/incidents'
import BarChart from './BarChart'
import IncidentList from './IncidentList'
import IncidentCountTable from './IncidentCountTable'
import IncidentMap from './IncidentMap'
import StateSelection from './StateSelection'
import UILoader from '@components/ui-loader'

import { useRouter, routeChange } from '@hooks/useRouter'
import { isObjEmpty } from '@utils'

const Home = () => {
    const router = useRouter()

    const defaultDateRange = isObjEmpty(router.query)
        ? [moment().subtract(1, 'years').toDate(), new Date()]
        : [moment(router.query.from).toDate(), moment(router.query.to).toDate()]

    const [incidents, setIncidents] = useState([])
    const [selectedState, setSelectedState] = useState('')
    const [dateRange, setDateRange] = useState(defaultDateRange)
    const [incidentTimeSeries, setIncidentTimeSeries] = useState([])
    const [incidentAggregated, setIncidentAggregated] = useState([])
    const [loading, setLoading] = useState(false)

    // stats [{'2021-01-02:1}, {'2021-01-01:1}...]  dates descending
    const mergeDate = (stats, start_date, end_date) => {
        const new_stats = []
        let start = moment(start_date)
        const end = moment(end_date)
        while (start <= end) {
            const strDate = start.format('YYYY-MM-DD')
            if (stats.length > 0 && stats[stats.length - 1].key == strDate) {
                //found the date in stats, use it
                new_stats.push(stats[stats.length - 1])
                stats.pop()
            } else {
                new_stats.push({ key: strDate, value: null })
            }
            start.add(1, 'days')
        }
        return new_stats
    }
    const loadData = (updateMap = false) => {
        if (dateRange.length != 2) return

        setLoading(true)
        incidentsService
            .getIncidents(dateRange[0], dateRange[1], selectedState)
            .then((incidents) => setIncidents(incidents))
        incidentsService.getStats(dateRange[0], dateRange[1], selectedState).then((stats) => {
            setIncidentTimeSeries(mergeDate(stats.stats, dateRange[0], dateRange[1]))
            if (updateMap) {
                setIncidentAggregated(stats.total)
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        loadData()
    }, [selectedState])
    useEffect(() => {
        loadData(true) //update both incidents and map
    }, [dateRange])

    const { colors } = useContext(ThemeColors)

    // handle date change
    function handleDateRangeSelect(ranges) {
        setDateRange(ranges)

        router.push(`/home?from=${moment(ranges[0]).format('YYYY-MM-DD')}&to=${moment(ranges[1]).format('YYYY-MM-DD')}`)
    }

    function onStateChange(state) {
        setSelectedState(state)
    }
    return (
        <UILoader blocking={loading}>
            <div>
                <Row>
                    <Col xs='12'>
                        <Card>
                            <CardBody>
                                <Container>
                                    <Row>
                                        <Col xs='12' sm='auto'>
                                            <FormGroup>
                                                <Label>Location:</Label>{' '}
                                                <StateSelection value={selectedState} onChange={onStateChange} />{' '}
                                            </FormGroup>
                                        </Col>
                                        <Col xs='12' sm='auto'>
                                            <FormGroup>
                                                <Label>Time Period:</Label>{' '}
                                                <DateRangeSelector onChange={handleDateRangeSelect} value={dateRange} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Container>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className='match-height'>
                    <Col xl='8' lg='8' md='6' xs='12'>
                        <Card>
                            <CardBody>
                                <BarChart
                                    color={colors.primary.main}
                                    chart_data={incidentTimeSeries}
                                    state={selectedState}
                                />
                                <IncidentMap
                                    mapData={incidentAggregated}
                                    selectdState={selectedState}
                                    onChange={onStateChange}
                                />
                                <IncidentCountTable
                                    title={'Incident Count by State'}
                                    data={incidentAggregated}
                                    selectedState={selectedState}
                                    stateChanged={(state) => setSelectedState(state)}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl='4' lg='4' md='6' xs='12'>
                        <Card>
                            {/* <CardHeader>
                                <CardTitle>Hate Crime Incidents</CardTitle>
                            </CardHeader> */}
                            <CardBody>
                                <IncidentList data={incidents} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </UILoader>
    )
}

export default Home

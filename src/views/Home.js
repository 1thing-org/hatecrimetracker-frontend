import UILoader from '@components/ui-loader'
import logo from '@src/assets/images/logo/logo.png'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import '@styles/react/libs/charts/recharts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Container, FormGroup, Label, Row } from 'reactstrap'
import 'rsuite/dist/styles/rsuite-dark.css'
import * as incidentsService from '../services/incidents'
import BarChart from './BarChart'
import DateRangeSelector from './DateRangeSelector'
import IncidentCountTable from './IncidentCountTable'
import IncidentList from './IncidentList'
import IncidentMap from './IncidentMap'
import StateSelection from './StateSelection'
import { useRouter } from '@hooks/useRouter'
import { isObjEmpty } from '@utils'
import { getValidState } from '../utility/Utils';
import { withRouter } from "react-router-dom";
import { da } from 'date-fns/locale'
const Home = () => {
    const router = useRouter()

    const [filter, setFilter] = useState({
        'state': router.query.state,
        'dateRange': isObjEmpty(router.query)
            ? [moment().subtract(1, 'years').toDate(), new Date()]
            : [moment(router.query.from).toDate(), moment(router.query.to).toDate()]
    })
    const [incidents, setIncidents] = useState([])
    const [strCurrDateRange, setStrCurrDateRange] = useState('')
    const [incidentTimeSeries, setIncidentTimeSeries] = useState([
        {
            monthly_cases: 0,
            key: moment().format('YYYY-MM-DD'),
            value: 0
        }

    ])
    const [incidentAggregated, setIncidentAggregated] = useState([])
    const [loading, setLoading] = useState(false)

    // stats [{'2021-01-02:1}, {'2021-01-01:1}...]  dates descending
    // Remove date out of the range, and insert days that does not have data
    // start_date, end_date: Date
    // monthly: monthly aggregation { first_day_of_month: count_of_the_month }
    const mergeDate = (stats, start_date, end_date, monthly) => {
        const new_stats = []
        let start = moment(start_date)
        const end = moment(end_date)
        const strStartDate = start.format('YYYY-MM-DD')
        const strEndDate = end.format('YYYY-MM-DD')
        while (start <= end) {
            const strDate = start.format('YYYY-MM-DD')
            const monthlyData = monthly[start.format('YYYY-MM')]
            if (stats.length > 0) {
                if (stats[stats.length - 1].key < strStartDate || stats[stats.length - 1].key > strEndDate) {
                    stats.pop()
                    continue //skip data that is out of range
                }
                if (stats[stats.length - 1].key == strDate) {
                    //found the date in stats, use it
                    new_stats.push({
                        monthly_cases: monthlyData,
                        ...stats[stats.length - 1]
                    })
                    stats.pop()
                    continue
                }
            }
            new_stats.push({ key: strDate, value: null, monthly_cases: monthlyData })
            start.add(1, 'days')
        }
        return new_stats
    }
    const formatDate = (d) => d ? moment(d).format('YYYY-MM-DD') : '';
    const toURL = (from, to, state) => {
        const params = [];
        if (from) {
            params.push('from=' + formatDate(from));
        }
        if (to) {
            params.push('to=' + formatDate(to));
        }
        if (state) {
            params.push('state=' + state);
        }
        return "/home" + (params.length > 0 ? "?" + params.join("&") : "");
    }
    const loadData = (updateMap = false) => {
        if (filter.dateRange?.length != 2) return

        setLoading(true)
        incidentsService
            .getIncidents(filter.dateRange[0], filter.dateRange[1], filter.state)
            .then((incidents) => setIncidents(incidents))
        incidentsService.getStats(filter.dateRange[0], filter.dateRange[1], filter.state).then((stats) => {
            setIncidentTimeSeries(mergeDate(stats.stats, filter.dateRange[0], filter.dateRange[1], stats.monthly_stats))
            if (updateMap) {
                setIncidentAggregated(stats.total)
            }
            setLoading(false)
        })
    }

    const isParameterChanged = () => {
        const cururl = toURL(router.query.from, router.query.to, router.query.state);
        const newurl = toURL(filter.dateRange?.[0], filter.dateRange?.[1], filter.state);
        return cururl !== newurl
    }
    const saveHistory = () => {
        //if date ranger or state is changed, save in router history
        if (!isParameterChanged()) {
            return;
        }
        const newurl = toURL(filter.dateRange?.[0], filter.dateRange?.[1], filter.state);

        router.history.push(newurl);
    }

    useEffect(() => {
        if (isParameterChanged()) {
            const defaultDateRange = isObjEmpty(router.query)
                ? [moment().subtract(1, 'years').toDate(), new Date()]
                : [moment(router.query.from).toDate(), moment(router.query.to).toDate()];

            setFilter({
                'state': getValidState(router.query.state),
                'dateRange': defaultDateRange
            });
        }

    }, [router])


    useEffect(() => {
        const strNewDateRange = `${formatDate(filter.dateRange?.[0])} - ${formatDate(filter.dateRange?.[1])}`;
        const refrehMap = strCurrDateRange !== strNewDateRange;
        setStrCurrDateRange(strNewDateRange);
        loadData(refrehMap)
        saveHistory();
    }, [filter])

    const { colors } = useContext(ThemeColors)

    // handle date change
    function handleDateRangeSelect(ranges) {
        if (ranges) {
            setFilter({
                'state': filter.state,
                'dateRange': ranges
            })
        }
    }

    function onStateChange(state) {
        setFilter({
            'dateRange': filter.dateRange,
            'state': state
        })
    }

    return (
        <UILoader blocking={loading}>
            <div>
                <Row>
                    <Col xs='12'>
                        <Container>
                            <Row>
                                <Col>
                                    <h4 className='card-title'>
                                        <img src={logo} alt='logo' className='logo' /> Anti-Asian Hate Crime Tracker
                                    </h4>
                                </Col>
                            </Row>

                            <FormGroup>
                                <Row>
                                    <Col xs='12' sm='auto'>
                                        <Label>Location:</Label>{' '}
                                        <StateSelection name='state' value={filter.state} onChange={onStateChange} />{' '}
                                    </Col>
                                    <Col xs='12' sm='auto'>
                                        <Label>Time Period:</Label>{' '}
                                        <DateRangeSelector
                                            name='date'
                                            onChange={handleDateRangeSelect}
                                            value={filter.dateRange}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Container>
                    </Col>
                </Row>
                <Row className='match-height'>
                    <Col xl='8' lg='8' md='6' xs='12'>
                        <div>
                            <BarChart
                                color={colors.primary.main}
                                chart_data={incidentTimeSeries}
                                state={filter.state}
                            />
                            <IncidentMap
                                mapData={incidentAggregated}
                                selectdState={filter.state}
                                onChange={onStateChange}
                            />
                            <IncidentCountTable
                                title={'Incident Count by State'}
                                data={incidentAggregated}
                                selectedState={filter.state}
                                stateChanged={(state) => onStateChange(state)}
                            />
                        </div>
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

export default withRouter(Home)

import UILoader from '@components/ui-loader'
import logo from '@src/assets/images/logo/logo.png'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import '@styles/react/libs/charts/recharts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Container, FormGroup, Label, Row, Button } from 'reactstrap'
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
import { useCookies } from 'react-cookie';
import { getBrowserLang, SUPPORTED_LANGUAGES } from '../utility/Languages';
import { SelectPicker } from 'rsuite'
import { withRouter } from 'react-router-dom'
import Head from './components/head'
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const Home = () => {
    const router = useRouter()
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    //get default lang
    //parameter lang > cookie > browser default setting
    const [cookies, setCookie] = useCookies(['lang']);
    const lang_code = router.query.lang || cookies.lang || getBrowserLang();
    const [selectedLangCode, setSelectedLangCode] = useState(lang_code);
    const support_languages = [];

    Object.entries(SUPPORTED_LANGUAGES).forEach(([lang_code, lang_name]) => {
        support_languages.push({
            value: lang_code,
            label: lang_name
        })
    });

    const [incidents, setIncidents] = useState([])
    const [selectedState, setSelectedState] = useState()
    const [dateRange, setDateRange] = useState()
    const [incidentTimeSeries, setIncidentTimeSeries] = useState([
        {
            monthly_cases: 0,
            key: moment().format('YYYY-MM-DD'),
            value: 0
        }
    ])
    const [incidentAggregated, setIncidentAggregated] = useState([])
    const [loading, setLoading] = useState(false)

    const setSelectedLang = (lang_code) => {
        setCookie('lang', lang_code);
        setSelectedLangCode(lang_code);
    }
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
    const loadData = (updateMap = false) => {
        if (dateRange?.length != 2) return

        setLoading(true)
        incidentsService
            .getIncidents(dateRange[0], dateRange[1], selectedState, selectedLangCode)
            .then((incidents) => setIncidents(incidents))
        incidentsService.getStats(dateRange[0], dateRange[1], selectedState).then((stats) => {
            setIncidentTimeSeries(mergeDate(stats.stats, dateRange[0], dateRange[1], stats.monthly_stats))
            if (updateMap) {
                setIncidentAggregated(stats.total)
            }
            setLoading(false)
        })
    }

    const isParameterChanged = () => {
        if (dateRange?.length != 2) {
            return true
        }
        const cururl = `/home?from=${moment(router.query.from).format('YYYY-MM-DD')}&to=${moment(
            router.query.to
        ).format('YYYY-MM-DD')}${router.query.state ? '&state=' + router.query.state.toUpperCase() : ''}`
        const newurl = `/home?from=${moment(dateRange[0]).format('YYYY-MM-DD')}&to=${moment(dateRange[1]).format(
            'YYYY-MM-DD'
        )}${selectedState ? '&state=' + selectedState.toUpperCase() : ''}`
        return cururl !== newurl
    }
    const saveHistory = () => {
        if (!dateRange || !selectedState) return
        //if date ranger or state is changed, save in router history
        if (!isParameterChanged()) {
            return
        }
        const newurl = `/home?from=${moment(dateRange[0]).format('YYYY-MM-DD')}&to=${moment(dateRange[1]).format(
            'YYYY-MM-DD'
        )}${selectedState ? "&state=" + selectedState.toUpperCase() : ''}`
            + `${selectedLangCode ? "&lang=" + selectedLangCode : ''}`;

        router.history.push(newurl)
    }

    useEffect(() => {
        if (isParameterChanged()) {
            const defaultDateRange = isObjEmpty(router.query)
                ? [moment().subtract(1, 'years').toDate(), new Date()]
                : [moment(router.query.from).toDate(), moment(router.query.to).toDate()]

            setSelectedState(getValidState(router.query.state))
            setDateRange(defaultDateRange)
        }
    }, [router])
    useEffect(() => {
        changeLanguage(selectedLangCode);
        loadData();
        saveHistory();
    }, [selectedState, selectedLangCode])
    //update both incidents and map
    useEffect(() => {
        loadData(true)
        saveHistory()
    }, [dateRange])

    const { colors } = useContext(ThemeColors)

    // handle date change
    function handleDateRangeSelect(ranges) {
        if (ranges) {
            setDateRange(ranges)
        }
    }

    function onStateChange(state) {
        setSelectedState(state)
    }

    return (
        <>
            <Head />
            <UILoader blocking={loading}>
                <div>
                    <Row>
                        <Col xs='12'>
                            <Container className='header'>
                                <Row className="align-items-center">
                                    <Col sm='8' xs='12'>
                                        <h4>
                                            <img src={logo} alt='logo' className='logo' /> {t('website.name')}
                                        </h4>
                                    </Col>
                                    <Col sm='4' xs='12' align='right'>
                                        <SelectPicker data={support_languages} searchable={false} cleanable={false} defaultValue={selectedLangCode} style={{ width: 120 }} onChange={(value) => setSelectedLang(value)} />
                                        &nbsp;&nbsp;
                                        <a href="https://docs.google.com/forms/d/1pWp89Y6EThMHml1jYGkDj5J0YFO74K_37sIlOHKkWo0" target='_blank'>{t('contact_us')}</a>
                                    </Col>
                                </Row>
                                
                                <FormGroup>
                                    <Row>
                                        <Col xs='12' sm='auto'>
                                            <Label>{t('location')}:</Label>{' '}
                                            <StateSelection
                                                name='state'
                                                value={selectedState}
                                                onChange={onStateChange}
                                            />{' '}
                                        </Col>
                                        <Col xs='12' sm='auto'>
                                            <Label>{t('date_range')}:</Label>{' '}
                                            <DateRangeSelector
                                                name='date'
                                                onChange={handleDateRangeSelect}
                                                value={dateRange}
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
                <div className='footer'>
                    <Row>
                        <Col sm='12' md={{ size: 6, offset: 3 }}>
                            <Row>
                                <Col sm={{ size: 'auto', offset: 1 }}>
                                    {t('copyright')} &copy; {new Date().getFullYear()}{' '}
                                    <a href='https://hatecrimetracker.1thing.org'> {t('website.name')} </a>
                                </Col>
                                <Col sm={{ size: 'auto', offset: 1 }}>
                                    <a
                                        href='https://docs.google.com/forms/d/1pWp89Y6EThMHml1jYGkDj5J0YFO74K_37sIlOHKkWo0'
                                        target='_blank'
                                    >
                                        {t('contact_us')}
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className='disclaimer'>
                    {t('disclaimer.title')}:
                        <ul>
                            <li>
                                {t('disclaimer.1')}
                            </li>
                            <li>
                                <Trans i18nKey='disclaimer.2'>
                                    disclaimer.2 <a href='https://docs.google.com/forms/d/1pWp89Y6EThMHml1jYGkDj5J0YFO74K_37sIlOHKkWo0' target="_blank">here.</a>
                                </Trans>
                            </li>
                            <li>
                            {t('disclaimer.3')}
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </UILoader>
        </>
    )
}

export default withRouter(Home)

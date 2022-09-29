import UILoader from './components/ui-loader';
import logo from '../assets/images/logo/logo.png';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Label,
  Row,
} from 'reactstrap';
import 'rsuite/dist/rsuite.min.css';
import * as incidentsService from '../services/incidents';
import IncidentChart from './IncidentChart';
import IncidentChartPer10kAsian from './IncidentChartPer10kAsian';
import DateRangeSelector from './DateRangeSelector';
import IncidentCountTable from './IncidentCountTable';
import IncidentList from './IncidentList';
import IncidentMap from './IncidentMap';
import StateSelection from './StateSelection';
import { useLocation, useNavigate } from 'react-router-dom';
import { getValidState, isObjEmpty } from '../utility/Utils';
import { useCookies } from 'react-cookie';
import { getBrowserLang, SUPPORTED_LANGUAGES } from '../utility/Languages';
import { SelectPicker } from 'rsuite';
import { useSearchParams } from 'react-router-dom';
import Head from './components/head';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import './Home.css'
import { RiShareForwardFill } from 'react-icons/ri';
import SocialMedia from './components/social-media'
import SocialMediaPopup from './components/social-media-pop-up'
import '../assets/scss/charts/recharts.scss';


const Home = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation()
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  //get default lang
  //parameter lang > cookie > browser default setting
  const [cookies, setCookie] = useCookies(['lang']);
  const lang_code = searchParams.get("lang") || cookies.lang || getBrowserLang();
  const [selectedLangCode, setSelectedLangCode] = useState(lang_code);
  const support_languages = [];

  Object.entries(SUPPORTED_LANGUAGES).forEach(([lang_code, lang_name]) => {
    support_languages.push({
      value: lang_code,
      label: lang_name,
    });
  });

  const isMobile = (window.innerWidth <= 786)
  const [isShowPer10kAsian, setIsShowPer10kAsian] = useState(false)
  const [incidents, setIncidents] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [dateRange, setDateRange] = useState();
  const [isFirstLoadData, setIsFirstLoadData] = useState(true)
  const [deviceSize, changeDeviceSize] = useState(window.innerWidth);
  const [incidentTimeSeries, setIncidentTimeSeries] = useState([
    {
      monthly_cases: 0,
      key: moment().format('YYYY-MM-DD'),
      value: 0,
    },
  ]);
  const [monthlyCount, setMonthlyCount] = useState([]);
  const [incidentAggregated, setIncidentAggregated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShare, setIsShare] = useState(false)
  const setSelectedLang = (lang_code) => {
    setCookie('lang', lang_code);
    setSelectedLangCode(lang_code);
  };
  // stats [{'2021-01-02:1}, {'2021-01-01:1}...]  dates descending
  // Remove date out of the range, and insert days that does not have data
  // start_date, end_date: Date
  // monthly: monthly aggregation { first_day_of_month: count_of_the_month }
  const mergeDate = (stats, start_date, end_date, monthly) => {
    const new_stats = [];
    let start = moment(start_date);
    const end = moment(end_date);
    const strStartDate = start.format('YYYY-MM-DD');
    const strEndDate = end.format('YYYY-MM-DD');
    while (start <= end) {
      const strDate = start.format('YYYY-MM-DD');
      const monthlyData = monthly[start.format('YYYY-MM')];
      if (stats.length > 0) {
        if (
          stats[stats.length - 1].key < strStartDate ||
          stats[stats.length - 1].key > strEndDate
        ) {
          stats.pop();
          continue; //skip data that is out of range
        }
        if (stats[stats.length - 1].key == strDate) {
          //found the date in stats, use it
          new_stats.push({
            monthly_cases: monthlyData,
            ...stats[stats.length - 1],
          });
          stats.pop();
          continue;
        }
      }
      new_stats.push({ key: strDate, value: null, monthly_cases: monthlyData });
      start.add(1, 'days');
    }
    return new_stats;
  };
  const loadData = (updateMap = false) => {
    if (dateRange?.length != 2) return;

    setLoading(true);
    incidentsService
      .getIncidents(dateRange[0], dateRange[1], selectedState, selectedLangCode)
      .then((incidents) => setIncidents(incidents));
    incidentsService
      .getStats(dateRange[0], dateRange[1], selectedState)
      .then((stats) => {
        setIncidentTimeSeries(
          mergeDate(
            stats.stats,
            dateRange[0],
            dateRange[1],
            stats.monthly_stats
          )
        );
        setMonthlyCount(stats.monthly_stats);
        if (updateMap) {
          setIncidentAggregated(stats.total);
        }
        setLoading(false);
        setIsFirstLoadData(false)
      });
  };

  const generateUrl = (from, to, state, lang) => {
    return `/home?from=${moment(from).format('YYYY-MM-DD')}&to=${moment(
      to
    ).format('YYYY-MM-DD')}${state ? '&state=' + state.toUpperCase() : ''}${
      lang ? '&lang=' + lang : ''
    }`;
  };

  const isParameterChanged = () => {
    if (dateRange?.length != 2) {
      return true;
    }
    const cururl = generateUrl(
      searchParams.get("from"),
      searchParams.get("to"),
      searchParams.get("state"),
      searchParams.get("lang")
    );
    const newurl = generateUrl(
      dateRange[0],
      dateRange[1],
      selectedState,
      selectedLangCode
    );
    return cururl !== newurl;
  };
  const saveHistory = () => {
    if (!dateRange) return;
    //if date ranger or state is changed, save in router history
    if (!isParameterChanged()) return;
    const newurl = generateUrl(
      dateRange[0],
      dateRange[1],
      selectedState,
      selectedLangCode
    );

    navigate(newurl);
  };

  useEffect(() => {
    if (isParameterChanged()) {
      const defaultDateRange = isObjEmpty(searchParams.get("from"))
        ? [moment().subtract(1, 'years').toDate(), new Date()]
        : [
            moment(searchParams.get("from"),).toDate(),
            moment(searchParams.get("to"),).toDate(),
          ];

      setSelectedState(getValidState(searchParams.get("state"),));
      setDateRange(defaultDateRange);
    }
  }, [location]);
  useEffect(() => {
    // console.log("selectedState:" + selectedState)
    changeLanguage(selectedLangCode);
    loadData();
    saveHistory();
  }, [selectedState, selectedLangCode]);
  //update both incidents and map
  useEffect(() => {
    loadData(true);
    saveHistory();
  }, [dateRange]);

  useEffect(() => {
    const resizeW = () => changeDeviceSize(window.innerWidth);

    window.addEventListener("resize", resizeW); // Update the width on resize
    return () => window.removeEventListener("resize", resizeW);
  });
  const colors = {
    primary: {
      main: '#FEF753'
    }
  };

  // handle date change
  function handleDateRangeSelect(ranges) {
    if (ranges) {
      setDateRange(ranges);
    }
  }

  const stateToggled = (state) => {
    // console.log("This is:" + this);
    const newState = state == selectedState ? null : state
    // console.log("Toggle state:" + state + " selectedState:" + selectedState + " new state:" + newState)
    setSelectedState(newState);
  }

  return (
    <>
      {deviceSize < 786 && <> 
        <div className='wrapper-floatting-button'>
          <div className='floating-button-top' onClick={() => setIsShare(true)}>
              <p className='floating-text'>Follow Us</p>
          </div>
        </div>
        {/* <div className='wrapper-floatting-button'>
          <div className='floating-button-bottom' onClick={() => setIsShare(true)}>
              <p className='floating-text'>Share</p>
          </div>
        </div>  */}
        </>
      }
      {isShare && <SocialMediaPopup setIsSharing={() => {setIsShare(false)}} deviceSize={deviceSize}/>}
      <Head />
      <UILoader blocking={loading}>
        <div>
          <Row>
            <Col xs='12'>
              <Container className='header'>
                <Row className='align-items-center'>

                <Col xs='12' sm='12' md='8'>
                    <p className='title'>
                      <img src={logo} alt='logo' className='logo'  />{' '}
                      {t('website.name')}
                    </p>
                  </Col>

                  <Col xs='12' sm='12' md='4'>
                    <div className="OneRowItem d-flex align-items-center justify-content-md-end justify-content-xs-between justify-content-sm-between py-1">
                    {deviceSize >= 786 && <> 
                      <SocialMedia size={35}  bgStyle={{fill: "#000000"}} iconFillColor={"yellow"} />
                      &nbsp;
                      <button className="button-no-background" onClick={() => setIsShare(true)}>
                        <RiShareForwardFill size={25}/>
                      </button>
                    &nbsp;&nbsp; </>}
                    <a
                      href='https://docs.google.com/forms/d/1pWp89Y6EThMHml1jYGkDj5J0YFO74K_37sIlOHKkWo0'
                      target='_blank'
                      className='contact_us'
                    >
                      {t('contact_us')}
                    </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    
                    <SelectPicker
                      data={support_languages}
                      searchable={false}
                      cleanable={false}
                      defaultValue={selectedLangCode}
                      style={{ width: 120 }}
                      className = {"rs-theme-dark"}
                      onChange={(value) => setSelectedLang(value)}
                    />
                    </div>
                  </Col>
                </Row>

                <FormGroup>
                  <Row>
                    <Col xs='12' sm='12' md='auto' className='OneRowItem'>
                      <Label className='SimpleLabel'>{t('location')}:</Label>{' '}
                      <StateSelection
                        name='state'
                        value={selectedState}
                        onChange={setSelectedState}
                      />{' '}
                    </Col>
                    <Col xs='12' sm='12' md='auto' className='OneRowItem'>
                      <Label className='SimpleLabel'>{t('date_range')}:</Label>{' '}
                      <DateRangeSelector
                        name='date'
                        onChange={handleDateRangeSelect}
                        value={dateRange}
                        isMobile={isMobile}
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </Container>
            </Col>
          </Row>
          <Row className='match-height'>
            <Col xl='8' lg='6' md='12'>
              <div>

                <IncidentChart color={colors.primary.main} chart_data={incidentTimeSeries} state={selectedState}/>

                <IncidentMap
                  mapData={incidentAggregated}
                  selectedState={selectedState}
                  lang={i18n.language}
                  showPer10KAsian={isShowPer10kAsian}
                  stateToggled={stateToggled}
                />
                <IncidentCountTable
                  title={'Incident Count by State'}
                  data={incidentAggregated}
                  selectedState={selectedState}
                  stateToggled={stateToggled}
                />
              </div>
            </Col>
            <Col xl='4' lg='6' md='12'>
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
                  <a href='https://hatecrimetracker.1thing.org'>
                    {' '}
                    {t('website.name')}{' '}
                  </a>
                </Col>
                <Col sm={{ size: 'auto', offset: 1 }}>
                  <a
                    href='https://docs.google.com/forms/d/1pWp89Y6EThMHml1jYGkDj5J0YFO74K_37sIlOHKkWo0'
                    target='_blank'
                    className="contact_us"
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
              <li>{t('disclaimer.1')}</li>
              <li>
              <Trans i18nKey='disclaimer.2'>
                  disclaimer.2 <a href='https://docs.google.com/forms/d/1pWp89Y6EThMHml1jYGkDj5J0YFO74K_37sIlOHKkWo0' target="_blank">here.</a>
              </Trans>
              </li>
              <li>{t('disclaimer.3')}</li>
            </ul>
          </div>
        </div>
      </UILoader>
    </>
  );
};

export default /*withRouter*/(Home);

import { ThemeColors } from '@src/utility/context/ThemeColors';
import '@styles/react/libs/charts/recharts.scss';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import moment from 'moment';
import { useContext, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardLink, CardText, CardTitle, Col, Row } from 'reactstrap';
import DateRangeSelector from './DateRangeSelector';
import 'rsuite/dist/styles/rsuite-default.css';
import * as incidentsService from "../services/incidents";
import BarChart from "./BarChart";
import IncidentList from './IncidentList';
import IncidentCountTable from './IncidentCountTable';
import IncidentMap from "./IncidentMap";
import StateSelection from './StateSelection';

const Home = () => {

  const [incidents, setIncidents] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [dateRange, setDateRange] = useState([moment().subtract(1, 'years').toDate(), new Date()]);
  const [incidentTimeSeries, setIncidentTimeSeries] = useState( []);
  const [incidentAggregated, setIncidentAggregated] = useState( []);

  // stats [{'2021-01-02:1}, {'2021-01-01:1}...]  dates descending
  const mergeDate = (stats, start_date, end_date) => {
    const new_stats = [];
    let start = moment(start_date);
    const end = moment(end_date);
    while (start <= end) {
      const strDate = start.format('YYYY-MM-DD');
      if (stats.length > 0 && stats[stats.length - 1].key == strDate) {
        //found the date in stats, use it
        new_stats.push(stats[stats.length - 1]);
        stats.pop();
      }
      else {
        new_stats.push({ key: strDate, value: null });
      }
      start.add(1, 'days');
    }
    return new_stats;
  }
  const loadData = (updateMap = false) => {
    if ( dateRange.length != 2 )
      return;
    incidentsService.getIncidents(dateRange[0], dateRange[1], selectedState)
      .then(incidents => setIncidents(incidents));
    incidentsService.getStats(dateRange[0], dateRange[1], selectedState)
      .then(stats => {
        setIncidentTimeSeries(mergeDate(stats.stats, dateRange[0], dateRange[1]));
        if ( updateMap ) {
          setIncidentAggregated(stats.total);
        }
      });
  }

  useEffect(() => {
    loadData();
  }, [selectedState]);
  useEffect(() => {
    loadData(true); //update both incidents and map
  }, [dateRange]);

  const { colors } = useContext(ThemeColors)
  function handleDateRangeSelect(ranges) {
    setDateRange(ranges);
  }

  function onStateChange(state){
    setSelectedState(state);
  }
  return (
    <div>
      <Row>
        <Col xs='12' >
          <Card>
            <CardBody>
              Location: <StateSelection value={selectedState} onChange={onStateChange}/>
              &nbsp;&nbsp;
              Time Period: <DateRangeSelector onChange={handleDateRangeSelect} value={dateRange}/>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className='match-height'>
        <Col xl='8' lg='8' md='6' xs='12'>
          <Card>
            <CardBody>
              <BarChart warning={colors.warning.main} chart_data={incidentTimeSeries} />
              <IncidentMap mapData={incidentAggregated} selectdState={selectedState} onChange={onStateChange}/>
              <IncidentCountTable title={"Incident Count by State"} data={incidentAggregated} 
              selectedState={selectedState}
              stateChanged={(state) => setSelectedState(state)}/>
            </CardBody>
          </Card>
        </Col>
        <Col xl='4' lg='4' md='6' xs='12'>
          <Card>
            <CardHeader>
              <CardTitle>Hate Crime Incidents</CardTitle>
            </CardHeader>
            <CardBody>
              <IncidentList data={incidents} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home

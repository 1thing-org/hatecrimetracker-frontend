import { ThemeColors } from '@src/utility/context/ThemeColors';
import '@styles/react/libs/charts/recharts.scss';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import * as dateFns from 'date-fns';
import moment from 'moment';
import { useContext, useState } from 'react';
import { Card, CardBody, CardHeader, CardLink, CardText, CardTitle, Col, Row } from 'reactstrap';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import * as incidentsService from "../services/incidents";
import BarChart from "./BarChart";
import IncidentTable from './IncidentTable';
import LineChart from "./LineChart";
import MapChart from "./MapChart";

//These are needed for charts

const Home = () => {

  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ stats: [], total: {} });

  const {
    afterToday,
  } = DateRangePicker;
  const dateRanges = [
    {
      label: 'Last Month',

      value: [dateFns.addMonths(new Date(), -1), new Date()]
    },
    {
      label: 'Previous Month',

      value: [dateFns.startOfMonth(dateFns.addMonths(new Date(), -1)), dateFns.endOfMonth(dateFns.addMonths(new Date(), -1))]
    },
    {
      label: 'Last Year',
      value: [dateFns.addYears(new Date(), -1), new Date()]
    },
    {
      label: 'Previous Year',
      value: [dateFns.startOfYear(dateFns.addYears(new Date(), -1)), dateFns.endOfYear(dateFns.addYears(new Date(), -1))]
    }
  ];
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
  const { colors } = useContext(ThemeColors)
  function handleDateRangeSelect(ranges) {
    incidentsService.getIncidents(ranges[0], ranges[1])
      .then(incidents => setIncidents(incidents));
    incidentsService.getStats(ranges[0], ranges[1])
      .then(stats => {
        stats.stats = mergeDate(stats.stats, ranges[0], ranges[1]);
        setStats(stats);
      });
  }

  return (
    <div>
      <DateRangePicker ranges={dateRanges} disabledDate={afterToday()} onChange={handleDateRangeSelect} />
      <Row className='match-height'>
        <Col xl='8' lg='8' md='6' xs='12'>
          <BarChart warning={colors.warning.main} chart_data={stats.stats} />
          <LineChart warning={colors.warning.main} chart_data={stats.stats} />
          <Card>
            <CardHeader>
              <CardTitle>Hate Crime Map</CardTitle>
            </CardHeader>
            <CardBody>
              <MapChart />
            </CardBody>
          </Card>
        </Col>
        <Col xl='4' lg='4' md='6' xs='12'>
          <Card>
            <CardHeader>
              <CardTitle>News Placeholder </CardTitle>
            </CardHeader>
            <CardBody>
              <CardText>Hate Crime Trend</CardText>
              <CardText>
                <IncidentTable
                  data={incidents}
                />
                news placeholder abc dummy link
                <CardLink
                  href='https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/'
                  target='_blank'
                >
                  Template Documentation
                </CardLink>
              </CardText>
              <CardText>
                news placeholder abc
              </CardText>
              <CardText>
                news placeholder abc
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home

import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Row, Col } from 'reactstrap'
import 'rsuite/dist/styles/rsuite-default.css';
import DataTable from 'react-data-table-component';
import { DateRangePicker } from 'rsuite';
import * as dateFns from 'date-fns';
import { Fragment, useContext, useState } from 'react'
import moment from 'moment';
import MapChart from "./MapChart"
import LineChart from "./LineChart"
import * as incidentsService from "../services/incidents"
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/charts/recharts.scss'
//These are needed for charts

const Home = () => {

  // ** Data grid that shows list of events
  const [data, setData] = useState([]);
  const columns = [
    {
      name: 'Date',
      selector: 'incident_time',
      sortable: true,
      format: row => moment(row.incident_time).format('MM/DD/YYYY'),
      width: "100px"
    },
    {
      name: 'Location',
      selector: 'incident_location',
      sortable: true,
      width:"80px"
    },
    {
      name: 'Title',
      selector: 'title',
      sortable: true,
      max_width:"600px",
      wrap : true,
      format: (row) => {
        if (row.url) {
          return <a href={row.url} target='_blank'>{row.title}</a>;
        }
        return row.title;
      }
    }
  ];
  // ** Data grid that shows list of events

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
  const { colors } = useContext(ThemeColors)
  function handleDateRangeSelect(ranges) {
    incidentsService.getIncidents(ranges[0], ranges[1])
      .then(incidents => setData(incidents));
  }
  return (
    <div>
      <DateRangePicker  ranges={dateRanges} disabledDate={afterToday()} onChange={handleDateRangeSelect}/> 
      <Row className='match-height'>
        <Col xl='8' lg='8' md='6' xs='12'>
          <LineChart warning={colors.warning.main} />
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
              <DataTable striped={true}
                  columns={columns}
                  data={data}
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

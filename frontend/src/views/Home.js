import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Row, Col } from 'reactstrap'

import { Fragment, useContext } from 'react'

import MapChart from "./MapChart"
import LineChart from "./LineChart"

import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/charts/recharts.scss'
//These are needed for charts

const Home = () => {

  const { colors } = useContext(ThemeColors)

  return (
    <div>
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

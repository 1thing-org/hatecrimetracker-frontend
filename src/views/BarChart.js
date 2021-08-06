import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import { ArrowDown } from 'react-feather'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  {
    "key": "2021-02-16", 
    "value": 2
  }, 
  {
    "key": "2021-02-15", 
    "value": 1
  }, 
  {
    "key": "2021-02-12", 
    "value": 2
  }, 
  {
    "key": "2021-02-11", 
    "value": 2
  }, 
  {
    "key": "2021-02-09", 
    "value": 1
  }, 
  {
    "key": "2021-02-08", 
    "value": 1
  }, 
  {
    "key": "2021-02-07", 
    "value": 1
  }, 
  {
    "key": "2021-02-03", 
    "value": 3
  }, 
  {
    "key": "2021-01-31", 
    "value": 2
  }, 

  {
    "key": "2021-01-28", 
    "value": 1
  }, 
  {
    "key": "2021-01-27", 
    "value": 1
  }, 
  {
    "key": "2021-01-22", 
    "value": 1
  }, 
  {
    "key": "2021-01-13", 
    "value": 2
  },

  {
    "key": "2021-01-01", 
    "value": 1
  }
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload[0] && payload[0].value) {
    return (
      <div className='recharts-custom-tooltip'>
        <span>{`${payload[0].value} cases`}</span>
      </div>
    )
  }

  return null
}

const SimpleBarChart = ({ warning, chart_data }) => {
  console.log(chart_data)
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>United States Hate Crime Incident Count</CardTitle>
        </div>
      </CardHeader>

      <CardBody>
        <div className='recharts-wrapper'>
          <ResponsiveContainer>
            <BarChart height={300} data={chart_data}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey='key' />
              <YAxis />
              <Tooltip content={CustomTooltip} />
              <Bar dataKey='value' stroke={warning} strokeWidth={3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
export default SimpleBarChart

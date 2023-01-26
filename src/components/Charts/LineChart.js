import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import { ArrowDown } from 'react-feather'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// const data = [
//   {
//     "key": "2021-02-16", 
//     "value": 2
//   }, 
//   {
//     "key": "2021-02-15", 
//     "value": 1
//   }, 
//   {
//     "key": "2021-02-12", 
//     "value": 2
//   }, 
//   {
//     "key": "2021-02-11", 
//     "value": 2
//   }, 
//   {
//     "key": "2021-02-09", 
//     "value": 1
//   }, 
//   {
//     "key": "2021-02-08", 
//     "value": 1
//   }, 
//   {
//     "key": "2021-02-07", 
//     "value": 1
//   }, 
//   {
//     "key": "2021-02-03", 
//     "value": 3
//   }, 
//   {
//     "key": "2021-01-31", 
//     "value": 2
//   }, 
//   {
//     "key": "2021-01-29", 
//     "value": null
//   }, 
//   {
//     "key": "2021-01-28", 
//     "value": 1
//   }, 
//   {
//     "key": "2021-01-27", 
//     "value": 1
//   }, 
//   {
//     "key": "2021-01-22", 
//     "value": 1
//   }, 
//   {
//     "key": "2021-01-13", 
//     "value": 2
//   },
//   {
//     "key": "2021-01-04", 
//     "value": null
//   },
//   {
//     "key": "2021-01-03", 
//     "value": null
//   },
//   {
//     "key": "2021-01-02", 
//     "value": null
//   }, 
//   {
//     "key": "2021-01-01", 
//     "value": 1
//   }
// ]

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

const SimpleLineChart = ({ warning, chart_data }) => {
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
            <LineChart height={300} data={chart_data}>
              <CartesianGrid />
              <XAxis dataKey='key' />
              <YAxis />
              <Tooltip content={CustomTooltip} />
              <Line dataKey='value' stroke={warning} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
export default SimpleLineChart

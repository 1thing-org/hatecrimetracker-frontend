import moment from 'moment';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload[0] && payload[0].value) {
    const d = moment(payload[0].payload.key, "YYYY-MM-DD")
    const strDate = d.format("M/D/YYYY");
    return (
      <div className='recharts-custom-tooltip'>
        <p>{strDate}</p>
        <strong>{payload[0].value + " " + (payload[0].value>1? 'cases' : 'case')}</strong>
      </div>
    )
  }

  return null
}

const SimpleBarChart = ({ color, chart_data }) => {
  const formatXAxis = (tickVal) => { //yyyy-mm-dd to mm/dd/2021
    const d = moment(tickVal, "YYYY-MM-DD")
    return d.format("M/D/YY");
  }
  const [xticks, setXTicks] = useState([]);
  useEffect(() => {
    const newXTicks = [];
    for( let i = 0; i < chart_data.length; i++ ) {
      const d = moment(chart_data[i].key, "YYYY-MM-DD")
      //if total dates>6M, show ticks at first day of each month
      //if between 3M-6M show on 15th of each month too
      //if <3M, show 8th, 22nd too
      switch(d.date()) {
        case 1:
          newXTicks.push(chart_data[i].key);
          break;
        case 15:
          if ( chart_data.length <= 180 ) { 
            newXTicks.push(chart_data[i].key);
          }
          break;
        case 8:
        case 22:
          if ( chart_data.length <= 90 ) { 
            newXTicks.push(chart_data[i].key);
          }
          break;
      }
    }
    setXTicks(newXTicks);
  }, [chart_data]);
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Hate Crime Incident Trend</CardTitle>
        </div>
      </CardHeader>

      <CardBody>
        <div className='recharts-wrapper'>
          <ResponsiveContainer>
            <BarChart height={300} data={chart_data}>
            <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='key' tickFormatter={formatXAxis} interval="preserveStartEnd" ticks={xticks} />
              <YAxis allowDecimals={false} interval="preserveStartEnd"/>
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey='value' stroke={chart_data.length>60?color:undefined} fill={color} strokeWidth={3}  />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
export default SimpleBarChart

import moment from 'moment';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { ComposedChart, Area, Bar, Legend, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { stateFullName } from '../utility/Utils';

const SimpleBarChart = ({ color, chart_data, state }) => {
  const formatXAxis = (tickVal) => { //yyyy-mm-dd to mm/dd/2021
    const d = moment(tickVal, "YYYY-MM-DD")
    return d.format("M/D/YY");
  }
  const [xticks, setXTicks] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [tooltip, setTooltip] = useState(); //decide which tooltip to show
  useEffect(() => {
    const newXTicks = [];
    let total = 0;
    for (let i = 0; i < chart_data.length; i++) {
      total += chart_data[i].value;
      const d = moment(chart_data[i].key, "YYYY-MM-DD")
      //if total dates>6M, show ticks at first day of each month
      //if between 3M-6M show on 15th of each month too
      //if <3M, show 8th, 22nd too
      switch (d.date()) {
        case 1:
          newXTicks.push(chart_data[i].key);
          break;
        case 15:
          if (chart_data.length <= 180) {
            newXTicks.push(chart_data[i].key);
          }
          break;
        case 8:
        case 22:
          if (chart_data.length <= 90) {
            newXTicks.push(chart_data[i].key);
          }
          break;
      }
    }
    setXTicks(newXTicks);
    setTotalCases(total);
  }, [chart_data]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload[0] && payload[0].value) {
      const d = moment(payload[0].payload.key, "YYYY-MM-DD")
      const monthly = payload[0].payload.monthly_cases;
      const daily = payload[0].payload.value ? payload[0].payload.value : 0;
      return tooltip !== 'daily' ? (
        <div className='recharts-custom-tooltip'>
          <p>{d.format("MMM YYYY")}</p>
          <p><strong>{monthly + " total " + (monthly > 1 ? 'cases' : 'case')}</strong></p>
        </div>
      ) :
        (
          <div className='recharts-custom-tooltip'>
            <p>{d.format("M/D/YYYY")}</p>
            <p><strong>{daily + " " + (daily ? 'cases' : 'case')}</strong></p>
            <p><strong>{monthly + " monthly " + (monthly > 1 ? 'cases' : 'case')}</strong></p>
          </div>
        )
    }
    return null
  }
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Hate Crime Incident Trend - Total {totalCases} Incidents {state ? "in " + stateFullName(state) : ""}</CardTitle>
        </div>
      </CardHeader>

      <CardBody>
        <div className='recharts-wrapper'>
          <ResponsiveContainer>
            <ComposedChart height={300} data={chart_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='key' tickFormatter={formatXAxis} interval="preserveStartEnd" ticks={xticks} />
              <YAxis allowDecimals={false} orientation="left" interval="preserveStartEnd"
                type="number"
                domain={['dataMin', 'dataMax + 3']}
                label={{ value: 'Daily Count', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" allowDecimals={false} interval="preserveStartEnd"
                label={{ value: 'Monthly Count', angle: 90, position: 'insideRight' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area name="Monthly Count" type="monotone" dataKey="monthly_cases" fill="#8884d8" stroke="#8884d8" yAxisId="right"
                onMouseOver={() => setTooltip('monthly')} />
              <Bar name="Daily Count" dataKey='value' stroke={chart_data.length > 60 ? color : undefined} fill={color} strokeWidth={3}
                onMouseOver={() => setTooltip('daily')} />
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
export default SimpleBarChart

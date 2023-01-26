import moment from 'moment';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { ComposedChart, Area, Bar, Legend, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { stateFullName } from '../utility/Utils';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import i18n from "i18next";
import './IncidentChartNoData.css'

const IncidentChart = ({ color, chart_data, state, isFirstLoadData }) => {
  const formatXAxis = (tickVal) => { //yyyy-mm-dd to mm/dd/2021
    const d = moment(tickVal, "YYYY-MM-DD")
    return d.format("M/D/YY");
  }
  const { t } = useTranslation();
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
          <p><strong>{t("incident_chart.total_monthly_cases", { count: monthly })}</strong></p>
        </div>
      ) :
        (
          <div className='recharts-custom-tooltip'>
            <p>{d.format("M/D/YYYY")}</p>
            <p><strong>{t("incident_chart.total_daily_cases", { count: daily })}</strong></p>
            <p><strong>{t("incident_chart.total_monthly_cases", { count: monthly })}</strong></p>
          </div>
        )
    }
    return null
  }
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>
            {t("incident_chart.trend")}&nbsp;-&nbsp;
            {(totalCases > 0) ? t("incident_chart.total_cases", { count: totalCases })
              : t("incident_chart.no_data")
            }
            {state ? " : " + stateFullName(state) : ""}
          </CardTitle>
        </div>
      </CardHeader>

      <CardBody>
        <div className='recharts-wrapper'>
          {(totalCases === 0 && !isFirstLoadData) ?  (
            <>
              <p className='add-data-button'>
                <Trans i18nKey='no_data_please_report'>
                  There is no data collected in the selected location and date range yet. Please click 
                    <a href='https://forms.gle/HRkVKW2Sfp7BytXj8' target='_blank'>here</a>
                    to report incidents to us.
                </Trans>
              </p>
              <div className='drop-down'/>
            </>
          ) : null}
          <ResponsiveContainer>
            <ComposedChart height={300} data={chart_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='key' tickFormatter={formatXAxis} interval="preserveStartEnd" ticks={xticks} />
              <YAxis allowDecimals={false} orientation="left" interval="preserveStartEnd"
                type="number"
                domain={[0, 'dataMax + 3']}
                label={{ value: t("daily_count"), angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" allowDecimals={false} interval="preserveStartEnd"
                label={{ value: t("monthly_count"), angle: 90, position: 'insideRight' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area name={t("monthly_count")} type="monotone" dataKey="monthly_cases" fill="#8884d8" stroke="#8884d8" yAxisId="right"
                onMouseOver={() => setTooltip('monthly')} />
              <Bar name={t("daily_count")} dataKey='value' stroke={chart_data.length > 60 ? color : undefined} fill={color} strokeWidth={3}
                onMouseOver={() => setTooltip('daily')} />
              <Legend wrapperStyle={{ position: 'relative', marginTop: '4px' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
export default IncidentChart

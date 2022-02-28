import * as dateFns from 'date-fns';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { BarChart, Bar, Legend, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { stateFullName, getStateIncidentPer10kAsian, formatIncidentRate } from '../utility/Utils';
import { useTranslation } from 'react-i18next';

// monthly_data={'2021-01':100, '2021-02': 50...}
const IncidentChartPer10kAsian = ({ color, monthly_stats, date_range, state }) => {
    const formatXAxis = (tickVal) => {
        const d = dateFns.parse(tickVal, "yyyy-MM", new Date())
        return dateFns.format(d, "M/yyyy");
    }

    const [monthlyData, setMonthlyData] = useState([])
    const { t } = useTranslation();
    const [totalCases, setTotalCases] = useState(0);

    useEffect(() => {
        //calc incident ration per 10k asian
        let monthly_data = [];
        let startDate = dateFns.set(date_range[0], {date:1}); //set to first day of the month
        let lastDate = dateFns.set(date_range[1], {date:1});
        lastDate = dateFns.addMonths(lastDate, 1); //set to first day of next the month
        let total = 0;
        for (let x_day = startDate; x_day < lastDate; x_day = dateFns.addMonths(x_day, 1)) {
            let month = dateFns.format(x_day, "yyyy-MM");
            if (monthly_stats[month]) {
                total += monthly_stats[month];
                monthly_data.push({
                    "key"   : month, //yyyy-MM
                    "cases" : monthly_stats[month],
                    "cases_per_10k" : formatIncidentRate(getStateIncidentPer10kAsian(monthly_stats[month], state))
                })
            }
            else {
                monthly_data.push({
                    "key"   : month, //yyyy-MM
                    "cases" : 0,
                    "cases_per_10k" : 0
                })
            }            
        }
        setMonthlyData(monthly_data);
        setTotalCases(total);
    }, [monthly_stats]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload[0] && payload[0].value) {
        const d = dateFns.parse(payload[0].payload.key, "yyyy-MM", new Date())
        const monthly = payload[0].payload.cases;
        const monthly_10k_asian = payload[0].payload.cases_per_10k;
        return (
            <div className='recharts-custom-tooltip'>
            <p>{dateFns.format(d, "MMM yyyy")}</p>
            <p><strong>{t("incident_chart.total_monthly_cases_per_10k_Asian", { count: monthly })}</strong></p>
            <p><strong>{t("incident_map.count_10k_asian") + " : " + monthly_10k_asian }</strong></p>
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
            <ResponsiveContainer>
                <BarChart height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />                
                <XAxis dataKey='key' tickFormatter={formatXAxis}/>
                <YAxis orientation="left" interval="preserveStartEnd"
                    type="number"
                    tickCount={5} 
                    allowDecimals={true}
                    domain={[0, 'auto']}
                    label={{ value: t("monthly_per_10k_asian"), angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name={t("monthly_per_10k_asian")} dataKey='cases_per_10k' stroke={monthlyData.length > 60 ? color : undefined} fill={color} strokeWidth={3}/>
                <Legend wrapperStyle={{ position: 'relative', marginTop: '4px' }} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </CardBody>   
        </Card>
    )
}
export default IncidentChartPer10kAsian;

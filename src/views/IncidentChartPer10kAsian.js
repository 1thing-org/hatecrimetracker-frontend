import moment from 'moment';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { ComposedChart, Bar, Legend, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { stateFullName } from '../utility/Utils';
import { useTranslation } from 'react-i18next';

const IncidentChartPer10kAsian = ({ color, chart_data, state }) => {
    const formatXAxis = (tickVal) => {
        const d = moment(tickVal, "YYYY-MM")
        return d.format("M/YY");
    }

    const [monthlyData, setMonthlyData] = useState([])
    const { t } = useTranslation();
    const [xticks, setXTicks] = useState([]);
    const [averageCases, setAverageCases] = useState(0);

    useEffect(() => {
        const map_data = chart_data.map(item => {
            return ({
                "key"   : moment(item.key, "YYYY-MM-DD").format("YYYY-MM"), 
                "cases" : item.monthly_cases/1000
            })
        })
        const mapped_data = map_data.filter( (ele, ind) => ind === map_data.findIndex( elem => elem.key === ele.key && elem.cases === ele.cases))
        setMonthlyData(mapped_data)
        const newXTicks = [];
        let total = 0;
        let count_month = 0
        for (let i = 0; i < mapped_data.length; i++) {
            count_month += 1
            total += mapped_data[i].cases;
            newXTicks.push(mapped_data[i].key)
        }
        setAverageCases((total/count_month).toFixed(2))
        setXTicks(newXTicks);
    }, [chart_data]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload[0] && payload[0].value) {
        const d = moment(payload[0].payload.key, "YYYY-MM")
        const monthly = payload[0].payload.cases;
        return (
            <div className='recharts-custom-tooltip'>
            <p>{d.format("MMM YYYY")}</p>
            <p><strong>{t("incident_chart.total_monthly_cases_per_10k_Asian", { count: monthly })}</strong></p>
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
                {(averageCases > 0) ? t("incident_chart.average_cases", { count: averageCases })
                : t("incident_chart.no_data")
                }
                {state ? " : " + stateFullName(state) : ""}
            </CardTitle>
            </div>
        </CardHeader>

        <CardBody>
            <div className='recharts-wrapper'>
            <ResponsiveContainer>
                <ComposedChart height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey='key' tickFormatter={formatXAxis} interval="preserveStartEnd" ticks={xticks} />
                <YAxis allowDecimals={false} orientation="left" interval="preserveStartEnd"
                    type="number"
                    domain={[0, 'dataMax+0.01']}
                    label={{ value: t("monthly_per_10k_asian"), angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name={t("monthly_per_10k_asian")} dataKey='cases' stroke={chart_data.length > 60 ? color : undefined} fill={color} strokeWidth={3}/>
                <Legend wrapperStyle={{ position: 'relative', marginTop: '4px' }} />
                </ComposedChart>
            </ResponsiveContainer>
            </div>
        </CardBody>   
        </Card>
    )
}
export default IncidentChartPer10kAsian;

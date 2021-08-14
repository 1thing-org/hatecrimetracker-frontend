import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import {getStateIncidentPerM, formatIncidentRate} from '../utility/Utils';
const columns = [
    {
        name: 'State',
        selector: 'state',
        sortable: true,
    },
    {
        name: 'Count',
        selector: 'count',
        sortable: true,
    },
    {
        name: 'Count/1MM',
        selector: 'count_rate',
        sortable: true,
        wrap: true,
        format: (row) => formatIncidentRate(row.count_rate)
    }
];
const toIncidentCount = (data) => {
    const result = [];
    for (const state in data) {
        const count = data[state];
        result.push({
            state,
            count,
            count_rate: getStateIncidentPerM(count, state)
        });
    }
    return result;
}
//data is map of state to count
const IncidentCountTable = ({ data, title }) => {
    const [incidentCountData, setIncidentCountData] = useState(toIncidentCount(data));
    //** ComponentDidMount
    useEffect(() => {
        setIncidentCountData(toIncidentCount(data));
    }, [data])
    return (<Card>
        <CardHeader>
          <div>
            <CardTitle tag='h4'>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
        <DataTable striped={true} columns={columns} data={incidentCountData} />
        </CardBody>
      </Card>);
}
export default IncidentCountTable

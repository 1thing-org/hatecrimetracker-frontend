import { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { formatIncidentRate, getStateIncidentPerM } from '../utility/Utils';
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
const IncidentCountTable = ({ data, title, selectedState, stateChanged }) => {
    const [incidentCountData, setIncidentCountData] = useState(toIncidentCount(data));
    const [currState, setCurrState] = useState(selectedState);
    //** ComponentDidMount
    useEffect(() => {
        setIncidentCountData(toIncidentCount(data));
    }, [data])
    useEffect(() => {
        setCurrState(selectedState);
    }, [selectedState])

    const conditionalRowStyles = [
        {
            when: (row) => row.state === currState,
            style: {
                color: "yellow",
                ':hover': { color: "yellow" },
                backgroundColor: '#000000',
                fontweight: 'bold',
            },
        },
        {
            when: (row) => row.state !== currState,
            style: {
                color: "white",
                backgroundColor: '#000000',
            },
        },
    ];
    const updateState = useCallback((row) => {
        stateChanged(row.state);
    });
    return (<Card>
        <CardHeader>
            <div>
                <CardTitle tag='h4'>{title}</CardTitle>
            </div>
        </CardHeader>
        <CardBody>
            <DataTable columns={columns} data={incidentCountData}
                keyField={"state"}
                noHeader={true}
                highlightOnHover
                onRowClicked={updateState}
                conditionalRowStyles={conditionalRowStyles}
                theme="dark"
            />
        </CardBody>
    </Card>);
}
export default IncidentCountTable

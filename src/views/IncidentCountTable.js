import { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { formatIncidentRate, getStateIncidentPerM, getStateIncidentPer10kAsian, stateFullName } from '../utility/Utils';
import { useTranslation } from 'react-i18next';

const toIncidentCount = (data) => {
    const result = [];
    for (const state in data) {
        const count = data[state];
        result.push({
            state: state,
            state_name: stateFullName(state),
            count: count,
            count_rate: getStateIncidentPerM(count, state),
            count_rate_asian: getStateIncidentPer10kAsian(count, state),
        });
    }
    return result;
}
//data is map of state to count
const IncidentCountTable = ({ data, title, selectedState, stateChanged }) => {
    const { t } = useTranslation();
    const [incidentCountData, setIncidentCountData] = useState(toIncidentCount(data));
    const [currState, setCurrState] = useState(selectedState);
    const [totalCases, setTotalCases] = useState(0);

    const columns = [
        {
            name: t("incident_table.state"),
            selector: 'state_name',
            sortable: true,
        },
        {
            name: t("incident_table.count"),
            selector: 'count',
            sortable: true,
            maxWidth: '20%',
            right: true,
        },
        {
            name: t("incident_table.count_10k_asian"),
            selector: 'count_rate_asian',
            sortable: true,
            wrap: true,
            maxWidth: '20%',
            right: true,
            format: (row) => formatIncidentRate(row.count_rate_asian)
        },
        {
            name: t("incident_table.count_1mm"),
            selector: 'count_rate',
            sortable: true,
            wrap: true,
            maxWidth: '20%',
            right: true,
            format: (row) => formatIncidentRate(row.count_rate)
        }
    ];
    //** ComponentDidMount
    useEffect(() => {
        setIncidentCountData(toIncidentCount(data));
        let total = 0;
        for (const state in data) {
            total += data[state];
        };
        setTotalCases(total);
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
                fontWeight: 'bold',
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
                <CardTitle tag='h4'>{t("incident_count_by_state")} - {t("incident_table.total_incident", {count:totalCases})}</CardTitle>
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

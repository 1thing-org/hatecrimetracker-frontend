import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
//Data of 2020
const StatePopulation = { 
    "AL": 5024279,
    "AK": 733391,
    "AS": 49437,
    "AZ": 7151502,
    "AR": 3011524,
    "CA": 39538223,
    "CO": 5773714,
    "CT": 3605944,
    "DE": 989948,
    "DC": 689545,
    "FL": 21538187,
    "GA": 10711908,
    "GU": 168485,
    "HI": 1455271,
    "ID": 1839106,
    "IL": 12812508,
    "IN": 6785528,
    "IA": 3190369,
    "KS": 2937880,
    "KY": 4505836,
    "LA": 4657757,
    "ME": 1362359,
    "MD": 6177224,
    "MA": 7029917,
    "MI": 10077331,
    "MN": 5706494,
    "MS": 2961279,
    "MO": 6154913,
    "MT": 1084225,
    "NE": 1961504,
    "NV": 3104614,
    "NH": 1377529,
    "NJ": 9288994,
    "NM": 2117522,
    "NY": 20201249,
    "NC": 10439388,
    "ND": 779094,
    "MP": 51433,
    "OH": 11799448,
    "OK": 3959353,
    "OR": 4237256,
    "PA": 13011844,
    "PR": 3285874,
    "RI": 1097379,
    "SC": 5118425,
    "SD": 886667,
    "TN": 6910840,
    "TX": 29145505,
    "VI": 106235,
    "UT": 3271616,
    "VT": 643077,
    "VA": 8631393,
    "WA": 7705281,
    "WV": 1793716,
    "WI": 5893718,
    "WY": 576851
}
const columns = [
    {
        name: 'State',
        selector: 'state',
        sortable: true,
        width: "100px"
    },
    {
        name: 'Count',
        selector: 'count',
        sortable: true,
    },
    {
        name: 'Count/1M',
        selector: 'count_per_m',
        sortable: true,
        wrap: true
    }
];
const toIncidentCount = (data) => {
    const result = [];
    for (const state in data) {
        const count = data[state];
        result.push({
            state,
            count,
            count_per_m: count / StatePopulation[state] * 1000000
        });
    }
    console.log(result)
    return result;
}
//data is map of state to count
const IncidentCountTable = ({ data, title }) => {
    const [incidentCountData, setIncidentCountData] = useState(toIncidentCount(data));
    //** ComponentDidMount
    useEffect(() => {
        setIncidentCountData(toIncidentCount(data));
    }, [data])
    return (
        <DataTable striped={true} title={title} columns={columns} data={incidentCountData} />
    )
}
export default IncidentCountTable

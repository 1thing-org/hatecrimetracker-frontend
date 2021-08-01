import axios from "axios";
import moment from "moment";
import config from "../configs/appConfig";
//Return promise that will return array of incidents order by date desc
export function getIncidents( startDate, endDate, state = null) {
    const incidentsAPIUrl =
        config.api_endpoint +
        "/incidents?start=" +  moment(startDate).format("YYYY-MM-DD") +
        "&end=" + moment(endDate).format("YYYY-MM-DD") +
        (state ? "&state=" + state : "");
    return axios.get(incidentsAPIUrl).then((response) => {
        return response.data.incidents;
    });
}

export function createIncident(incident) {
    const incidentAPIUrl = config.api_endpoint + "/incidents";
    if ( !incident.incident_source ){
        incident.incident_source = "MANUAL";
    }
    return axios.post(incidentAPIUrl, {incident:incident},
        {
            headers: {
                "Access-Control-Allow-Origin": "false",
                "strict-origin-when-cross-origin": "false"
            }
        }).then((response) => { return response.incident_id; });
}

export function deleteIncident(id) {
    const incidentAPIUrl = config.api_endpoint + "/incidents/" + id;
    return axios.delete(incidentAPIUrl).then((response) => { return response.data; });
}
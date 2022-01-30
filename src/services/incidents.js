import axios from "axios";
import moment from "moment";
import config from "../configs/appConfig";
//Return promise that will return array of incidents order by date desc
export function getIncidents( startDate, endDate, state = null, lang = 'en', skip_cache = false ) {
    const incidentsAPIUrl =
        config.api_endpoint +
        "/incidents?start=" +  moment(startDate).format("YYYY-MM-DD") +
        "&end=" + moment(endDate).format("YYYY-MM-DD") +
        "&lang=" + lang +
        (state ? "&state=" + state : "") +
        (skip_cache ? "&skip_cache=true" : "");
    return axios.get(incidentsAPIUrl,
        {
            headers: {
                "Access-Control-Allow-Origin": "false",
                "strict-origin-when-cross-origin": "false"
            }
        }).then((response) => {
        return response.data.incidents;
    });
}

export function getStats( startDate, endDate, state = null) {
    const statsAPIUrl =
        config.api_endpoint +
        "/stats?start=" +  moment(startDate).format("YYYY-MM-DD") +
        "&end=" + moment(endDate).format("YYYY-MM-DD") +
        (state ? "&state=" + state : "");
    return axios.get(statsAPIUrl,
        {
            headers: {
                "Access-Control-Allow-Origin": "false",
                "strict-origin-when-cross-origin": "false"
            }
        }).then((response) => {
        return response.data;
    });
}
export function upsertIncident(incident) {
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
export function createIncident(incident) {
    return upsertIncident(incident);
}

export function deleteIncident(id) {
    const incidentAPIUrl = config.api_endpoint + "/incidents/" + id;
    return axios.delete(incidentAPIUrl, 
        {
            headers: {
                "Access-Control-Allow-Origin": "false",
                "strict-origin-when-cross-origin": "false"
            }
        }).then((response) => { return response.data; });
}
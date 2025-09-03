import axios from "axios";
import moment from "moment";
import config from "../configs/appConfig";
//Return promise that will return array of incidents order by date desc
export function getIncidents( startDate, endDate, state = null, lang = 'en', self_report_status=null, type="news", skip_cache = false, page_size=100000) {
    const incidentsAPIUrl =
        config.api_endpoint +
        "/incidents?start=" +  moment(startDate).format("YYYY-MM-DD") +
        "&end=" + moment(endDate).format("YYYY-MM-DD") +
        (self_report_status? "&self_report_status=" + self_report_status:"") +
        "&type=" + type +
        (state ? "&state=" + state : "") +
        (skip_cache ? "&skip_cache=true" : "") +
        "&page_size=" + page_size;
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

export function getStats( startDate, endDate, state = null, self_report_status=null, type="news") {
    const statsAPIUrl =
        config.api_endpoint +
        "/stats?start=" +  moment(startDate).format("YYYY-MM-DD") +
        "&end=" + moment(endDate).format("YYYY-MM-DD") +
        (self_report_status? "&self_report_status=" + self_report_status:"") +
        "&type=" + type +
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
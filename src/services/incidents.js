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

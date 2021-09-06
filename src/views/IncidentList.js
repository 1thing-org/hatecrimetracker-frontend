import moment from 'moment'
import { useState, useEffect } from 'react'
import { stateFullName } from '../utility/Utils.js'
import { Button } from 'reactstrap'

const INCR_COUNT = 10;
const IncidentList = (props) => {
    const [visibleCount, setVisibleCount] = useState(20);
    useEffect(() => {
        setVisibleCount(INCR_COUNT);
    }, [props.data])
    const getTitle = (incident) => {
        if ( incident?.title_translate ) {
            for ( const [key, value] of Object.entries(incident.title_translate) ) {
                return value;
            }
        }
        return incident?.title;
    }
    const getAbstract = (incident) => {
        if ( incident?.abstract_translate ) {
            for ( const [key, value] of Object.entries(incident.abstract_translate) ) {
                return value;
            }
        }
        return incident?.abstract;
    }
    return (
        <div>
            <div className='incident-list'>
                {props.data.filter((d, idx) => idx < visibleCount).map(function (d, idx) {
                    return (
                        <div className='incident' key={idx}>
                            <a className='title' href={d.url} target='_blank'>
                                {getTitle(d)}
                            </a>
                            <p className='location_time'>
                                {stateFullName(d.incident_location)} | {moment(d.incident_time).format('MM/DD/YYYY')}
                            </p>
                            <p className='description'>{getAbstract(d)}</p>
                        </div>
                    )
                })
                }
            </div>
            {visibleCount < props.data.length ?
                (<div align='center'><Button className='btn-loadmore' size="sm" onClick={() => setVisibleCount(visibleCount + INCR_COUNT) }>Load More...</Button></div>)
                : null}
        </div>
    )
}
export default IncidentList

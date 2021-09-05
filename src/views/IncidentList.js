import moment from 'moment'
import { useState, useEffect } from 'react'
import { stateFullName } from '../utility/Utils.js'
import { Button } from 'reactstrap'

const IncidentList = (props) => {
    const [visibleCount, setVisibleCount] = useState(20);
    useEffect(() => {
        setVisibleCount(20);
    }, [props.data])
    return (
        <div>
            <div className='incident-list'>
                {props.data.filter((d, idx) => idx < visibleCount).map(function (d, idx) {
                    return (
                        <div className='incident' key={idx}>
                            <a className='title' href={d.url} target='_blank'>
                                {d.title}
                            </a>
                            <p className='location_time'>
                                {stateFullName[d.incident_location]} | {moment(d.incident_time).format('MM/DD/YYYY')}
                            </p>
                            <p className='description'>{d.abstract}</p>
                        </div>
                    )
                })
                }
            </div>
            {visibleCount < props.data.length ?
                (<div align='center'><Button className='btn-loadmore' size="sm" onClick={() => setVisibleCount(visibleCount + 20) }>Load More...</Button></div>)
                : null}
        </div>
    )
}
export default IncidentList

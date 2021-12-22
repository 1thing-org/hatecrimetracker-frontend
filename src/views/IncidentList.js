import moment from 'moment'
import { useState, useEffect } from 'react'
import { stateFullName } from '../utility/Utils.js'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next';
import {Input} from 'rsuite';

const INCR_COUNT = 10;
const IncidentList = (props) => {
    const { t } = useTranslation();
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


    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div>
            <Input 
            type="text"
            placeholder="Search keywords/url..." 
            onChange={(value) => {setSearchTerm(value)}}/>

            <div className='incident-list'>
                {props.data.filter((d, idx) => { idx < visibleCount
                {
                    if (searchTerm ==""){return d}                   
                    else if (d.title.toLowerCase().includes(searchTerm.toLowerCase())||
                             d.incident_location.toLowerCase().includes(searchTerm.toLowerCase())||
                             d.incident_time.includes(searchTerm)||
                             d.abstract.toLowerCase().includes(searchTerm.toLowerCase())||
                             d.url.toLowerCase().includes(searchTerm.toLowerCase())
                            ){return d}
                }
               
            }).map(function (d, idx) {
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
                (<div align='center'><Button className='btn-loadmore' size="sm" onClick={() => setVisibleCount(visibleCount + INCR_COUNT) }>{t('load_more')}.</Button></div>)
                : null}
        </div>
    )
}
export default IncidentList

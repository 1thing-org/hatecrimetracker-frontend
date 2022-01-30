import moment from 'moment'
import { useState, useEffect } from 'react'
import { stateFullName } from '../utility/Utils.js'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next';
import { Input } from 'rsuite';
import donationIcon from '@src/assets/images/icons/donation.svg';
import policeTipLineIcon from '@src/assets/images/icons/police-line.svg';
import helpTheVictimIcon from '@src/assets/images/icons/victim-support.svg';

const INCR_COUNT = 10;
const IncidentList = (props) => {
    const { t } = useTranslation();
    const [visibleLimit, setVisibleLimit] = useState(20);
    useEffect(() => {
        setVisibleLimit(INCR_COUNT);
    }, [props.data])
    const getTitle = (incident) => {
        if (incident?.title_translate) {
            for (const [key, value] of Object.entries(incident.title_translate)) {
                return value;
            }
        }
        return incident?.title;
    }
    const getAbstract = (incident) => {
        if (incident?.abstract_translate) {
            for (const [key, value] of Object.entries(incident.abstract_translate)) {
                return value;
            }
        }
        return incident?.abstract;
    }
    const maybeGetDonationLink = (incident) => {
        if (incident?.donation_link) {
            return (<img className='icon' src={donationIcon} alt='donation link' />)
        }
        return;
    }
    const maybeGetPoliceTipLine = (incident) => {
        if (incident?.police_tip_line) {
            return (<img className='icon' src={policeTipLineIcon} alt='police tip line' />)
        }
        return;
    }
    const maybeGetHelpTheVictim = (incident) => {
        if (incident?.help_the_victim) {
            return (<img className='icon' src={helpTheVictimIcon} alt='help the victim' />)
        }
        return;
    }
    let visibleCount = 0;

    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div>
            <Input
                className="mb-1"
                type="text"
                placeholder={t('search')}
                onChange={(value) => {
                    setSearchTerm(value)
                    setVisibleLimit(INCR_COUNT)
                }} />

            <div className='incident-list'>
                {
                    props.data.map(function (d, idx) {
                        if (searchTerm == "" && visibleCount >= visibleLimit) return;
                        if (searchTerm == "" || getTitle(d).toLowerCase().includes(searchTerm.toLowerCase()) ||
                            getAbstract(d).toLowerCase().includes(searchTerm.toLowerCase())) {
                            visibleCount++;
                            return (
                                <div className='incident' key={idx}>
                                    <a className='title' href={d.url} target='_blank'>
                                        {getTitle(d)}
                                    </a>
                                    {maybeGetDonationLink(d)}
                                    {maybeGetPoliceTipLine(d)}
                                    {maybeGetHelpTheVictim(d)}
                                    <p className='location_time'>
                                        {stateFullName(d.incident_location)} | {moment(d.incident_time).format('MM/DD/YYYY')}
                                    </p>
                                    <p className='description'>{getAbstract(d)}</p>
                                </div>
                            )
                        }
                    })
                }
            </div>
            {visibleLimit < props.data.length && searchTerm == "" ?
                (<div align='center'><Button className='btn-loadmore' size="sm" onClick={() => setVisibleLimit(visibleLimit + INCR_COUNT)}>{t('load_more')}.</Button></div>)
                : null}
        </div>
    )
}
export default IncidentList

import Modal from 'react-modal';
import moment from 'moment'
import { useState, useEffect } from 'react'
import { stateFullName } from '../utility/Utils.js'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next';
import { Input } from 'rsuite';
import donationIcon from '../assets/images/icons/donation.svg';
import policeTipLineIcon from '../assets/images/icons/police-line.svg';
import helpTheVictimIcon from '../assets/images/icons/victim-support.svg';
import openInNewTab from '../assets/images/icons/launch_black_24dp.svg';
import closeIcon from '../assets/images/icons/close_black_24dp.svg';

const INCR_COUNT = 10;
const IncidentList = (props) => {
    Modal.setAppElement('#root');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const getModalWidth = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 600) return '95%';
        else if (screenWidth < 1000) return '70%';
        else return '50%';
    }
    const getModalHeight = () => {
        if (window.innerWidth < 600 && window.innerHeight < 1000) return '95%';
        else return;
    }
    const modalStyle = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
            position: 'fixed',
            width: getModalWidth(),
            height: getModalHeight(),
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#292D33',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '40px'
        }
    };
    const openModal = () => {
        setModalIsOpen(true);
    }
    const closeModal = () => {
        setModalIsOpen(false);
    }
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
    const maybeGetHelpIcons = (incident) => {
        return (
            <span className='help-icons'>
                {incident?.donation_link ? (<img className='icon' src={donationIcon} alt='donation link' />) : null}
                {incident?.police_tip_line ? (<img className='icon' src={policeTipLineIcon} alt='police tip line' />) : null}
                {incident?.help_the_victim ? (<img className='icon' src={helpTheVictimIcon} alt='help the victim' />) : null}
            </span>
        )
    }
    const isHelpDivAvail = (incident) => {
        if (incident?.donation_link || incident?.police_tip_line || incident?.help_the_victim) return true;
        else return false;
    }
    const maybeGetHelpDiv = (incident) => {
        return (
            <div>
                {incident?.donation_link? (
                    <div className='row'>
                        <img className='icon col' src={donationIcon} alt='donation link' />
                        <div className='col'>
                            <a className='donation-link link-text' href={incident?.donation_link} target='_blank'>{t('make_a_donation')}</a>
                            <img className='open-in-new' src={openInNewTab} alt='open in new tab' />
                        </div>
                    </div>
                ): null}
                {incident?.police_tip_line? (
                    <div className='row'>
                        <img className='icon col' src={policeTipLineIcon} alt='police tip line' />
                        <p className='description col'><b>{t('police_tip_line')}</b>: {incident?.police_tip_line}</p>
                    </div>
                ): null}
                {incident?.help_the_victim? (
                    <div className='row'>
                        <img className='icon col' src={helpTheVictimIcon} alt='help the victim' />
                        <p className='description col'><b>{t('other_ways_to_help')}</b>: {incident?.help_the_victim}</p>
                    </div>
                ): null}
            </div>
        )
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
                                    <a className='incident-title' onClick={() => {
                                        setModalData(d);
                                        setModalIsOpen(true);
                                    }}>{getTitle(d)}</a>
                                    {maybeGetHelpIcons(d)}
                                    <p className='location-time'>
                                        {stateFullName(d.incident_location)} | {moment(d.incident_time).format('MM/DD/YYYY')}
                                    </p>
                                    <p className='description'>{getAbstract(d)}</p>
                                </div>
                            )
                        }
                    })
                }
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Incident details modal"
                style={modalStyle}
                className="details-modal"
            >
                <img className='close-modal-button' src={closeIcon} alt='close the modal' onClick={closeModal}/>
                <p className='incident-title'>{getTitle(modalData)}</p>
                <p className='location-time'>
                    {stateFullName(modalData?.incident_location)} | {moment(modalData?.incident_time).format('MM/DD/YYYY')}
                </p>
                <br></br>
                <p className='description'>{getAbstract(modalData)}</p>
                <br></br>
                <a className='link-text' href={modalData?.url} target='_blank'>{t('link_to_news_source')}</a>
                <img className='open-in-new' src={openInNewTab} alt='open in new tab' />
                {isHelpDivAvail(modalData)? (
                    <div className='support'>
                        <div className='title-with-line'>
                            <div className='title'>{t('how_to_help')}</div>
                            <div className='divider'></div>
                        </div>
                        {maybeGetHelpDiv(modalData)}
                    </div>
                ): null}
            </Modal>
            {props.data.length ?
                (<div className='icon-description'>
                    <div className='col'>
                        <img className='icon' src={donationIcon} alt='donation link' />
                        <p className='description'>{t('donate_to_support')}</p>
                    </div>
                    <div className='col'>
                        <img className='icon' src={policeTipLineIcon} alt='police tip line' />
                        <p className='description'>{t('tips_needed_from_police')}</p>
                    </div>
                    <div className='col'>
                        <img className='icon' src={helpTheVictimIcon} alt='help the victim' />
                        <p className='description'>{t('provide_addtional_support')}</p>
                    </div>
                </div>)
                : null}
            {visibleLimit < props.data.length && searchTerm == "" ?
                (<div align='center'><Button className='btn-loadmore' size="sm" onClick={() => setVisibleLimit(visibleLimit + INCR_COUNT)}>{t('load_more')}.</Button></div>)
                : null}
        </div>
    )
}
export default IncidentList

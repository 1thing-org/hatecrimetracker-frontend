import Modal from 'react-modal';
import moment from 'moment'
import { useState, useEffect } from 'react'
import { stateFullName } from '../utility/Utils.js'
import { Button, Card, CardBody, Row, Col, CardImg } from 'reactstrap'
import { useTranslation } from 'react-i18next';
import { Input } from 'rsuite';
import { FaUser, FaNewspaper } from 'react-icons/fa';
import donationIcon from '../assets/images/icons/donation.svg';
import policeTipLineIcon from '../assets/images/icons/police-line.svg';
import helpTheVictimIcon from '../assets/images/icons/victim-support.svg';
import openInNewTab from '../assets/images/icons/launch_black_24dp.svg';
import closeIcon from '../assets/images/icons/close_black_24dp.svg';

const INCR_COUNT = 10;
const VIDEO_EXT_RE = /\.(mp4|mov|m4v|avi|wmv|mkv|webm|3gp)(?:\?|$)/i;
const isVideoUrl = (url) => VIDEO_EXT_RE.test(url || "");

const IncidentList = (props) => {
    Modal.setAppElement('#root');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    // Gallery modal — fired by clicking an attachment thumbnail. Shows all
    // images / videos of the row as a navigable carousel.
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryUrls, setGalleryUrls] = useState([]);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const openGallery = (urls, startIndex) => {
        if (!Array.isArray(urls) || urls.length === 0) return;
        setGalleryUrls(urls);
        setGalleryIndex(Math.max(0, Math.min(startIndex || 0, urls.length - 1)));
        setGalleryOpen(true);
    };
    const closeGallery = () => setGalleryOpen(false);
    const galleryNext = () => setGalleryIndex(i => (i + 1) % galleryUrls.length);
    const galleryPrev = () => setGalleryIndex(i => (i - 1 + galleryUrls.length) % galleryUrls.length);

    // Allow keyboard navigation (←/→/Esc) while the gallery is open.
    useEffect(() => {
        if (!galleryOpen) return;
        const onKey = (e) => {
            if (e.key === "ArrowRight") galleryNext();
            else if (e.key === "ArrowLeft") galleryPrev();
            else if (e.key === "Escape") closeGallery();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [galleryOpen, galleryUrls.length]);
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
            for (const [, value] of Object.entries(incident.title_translate)) {
                return value;
            }
        }
        return incident?.title;
    }
    const getAbstract = (incident) => {
        if (incident?.abstract_translate) {
            for (const [, value] of Object.entries(incident.abstract_translate)) {
                return value;
            }
        }
        return incident?.abstract;
    }
    const maybeGetHelpIcons = (incident) => {
        // Skip the wrapper span entirely when there are no help links so an
        // empty inline element doesn't reserve space above the meta line —
        // especially noticeable on user-reported rows where the title is
        // hidden and these links are almost never present.
        if (!incident?.donation_link && !incident?.police_tip_line && !incident?.help_the_victim) {
            return null;
        }
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
                {incident?.donation_link ? (
                    <div className='row'>
                        <img className='icon col' src={donationIcon} alt='donation link' />
                        <div className='col'>
                            <a className='donation-link link-text' href={incident?.donation_link} target='_blank'>{t('make_a_donation')}</a>
                            <img className='open-in-new' src={openInNewTab} alt='open in new tab' />
                        </div>
                    </div>
                ) : null}
                {incident?.police_tip_line ? (
                    <div className='row'>
                        <img className='icon col' src={policeTipLineIcon} alt='police tip line' />
                        <p className='description col'><b>{t('police_tip_line')}</b>: {incident?.police_tip_line}</p>
                    </div>
                ) : null}
                {incident?.help_the_victim ? (
                    <div className='row'>
                        <img className='icon col' src={helpTheVictimIcon} alt='help the victim' />
                        <p className='description col'><b>{t('other_ways_to_help')}</b>: {incident?.help_the_victim}</p>
                    </div>
                ) : null}
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
                placeholder={t('search_for_news')}
                onChange={(value) => {
                    setSearchTerm(value)
                    setVisibleLimit(INCR_COUNT)
                }} />

            <div className='incident-list'>
                {
                    props.data.map((d, idx) => {
                        const normalizedSearch = (searchTerm || "").toLowerCase();

                        // title might be empty
                        const title = (getTitle(d) || "").toLowerCase();
                        const abstract = (getAbstract(d) || "").toLowerCase();

                        const matchesSearch =
                            normalizedSearch === "" ||
                            title.includes(normalizedSearch) ||
                            abstract.includes(normalizedSearch);

                        if (!matchesSearch) return null;

                        if (normalizedSearch === "" && visibleCount >= visibleLimit) return null;
                        visibleCount++;

                        const normalizedType = String(d.type || '').toLowerCase();
                        const isUserReport =
                            normalizedType === 'self_report' ||
                            (!d.type && !d.url && (
                                (Array.isArray(d.attachments) && d.attachments.length > 0) ||
                                !!d.contact_name ||
                                !!d.contact_email ||
                                !!d.contact_phone_number ||
                                d.self_report_status === 'approved' ||
                                d.self_report_status === 'new'
                            ));

                        return (
                            <div className={`incident-card${isUserReport ? ' is-user-report' : ''}`} key={idx}>
                                <Card className="border-0 shadow-sm mx-0">
                                    <CardBody className="p-0">
                                        {/* User-reported incidents typically have no title
                                            (or an auto-generated one), so the title link is
                                            hidden for them — the description below is the
                                            primary content, and clicking an attachment still
                                            opens the modal. News rows keep their title link. */}
                                        {!isUserReport && (
                                            <a className='incident-title'
                                                onClick={() => {
                                                    setModalData(d);
                                                    openModal();
                                                }}>{getTitle(d)}</a>
                                        )}
                                        {maybeGetHelpIcons(d)}
                                        <p className='location-time'>
                                            {props.showSelfReport && (
                                                <span
                                                    className={`source-icon ${isUserReport ? 'user-report' : 'news-report'}`}
                                                    data-tooltip={isUserReport ? t('user_reported') : t('media_reported')}
                                                    aria-label={isUserReport ? t('user_reported') : t('media_reported')}
                                                    role="img"
                                                >
                                                    {isUserReport
                                                        ? <FaUser aria-hidden="true" />
                                                        : <FaNewspaper aria-hidden="true" />}
                                                </span>
                                            )}
                                            {stateFullName(d.incident_location)} | {moment(d.incident_time).format('MM/DD/YYYY')}
                                        </p>
                                        <p className='description'>{getAbstract(d)}</p>
                                        {Array.isArray(d.attachments) && d.attachments.length > 0 && (
                                            <Row className="gx-2 gy-2 mt-2">
                                                {d.attachments.map((url, i) => (
                                                    <Col xs="4" md="3" key={i}>
                                                        {isVideoUrl(url) ? (
                                                            <video
                                                                src={url}
                                                                muted
                                                                playsInline
                                                                preload="metadata"
                                                                style={{
                                                                    aspectRatio: '1 / 1',
                                                                    width: '100%',
                                                                    objectFit: "cover",
                                                                    cursor: "pointer",
                                                                    background: "#000",
                                                                    borderRadius: 4,
                                                                }}
                                                                onClick={() => openGallery(d.attachments, i)}
                                                            />
                                                        ) : (
                                                            <CardImg
                                                                alt={`attachment-${i + 1}`}
                                                                src={url}
                                                                style={{
                                                                    aspectRatio: '1 / 1',
                                                                    width: '100%',
                                                                    objectFit: "cover",
                                                                    cursor: "pointer"
                                                                }}
                                                                onClick={() => openGallery(d.attachments, i)}
                                                            />
                                                        )}
                                                    </Col>
                                                ))}
                                            </Row>
                                        )}
                                    </CardBody>
                                </Card>
                                <div className="incident-divider" />
                            </div>
                        )

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
                <img className='close-modal-button' src={closeIcon} alt='close the modal' onClick={closeModal} />
                <p className='incident-title'>{getTitle(modalData)}</p>
                <p className='location-time'>
                    {stateFullName(modalData?.incident_location)} | {moment(modalData?.incident_time).format('MM/DD/YYYY')}
                </p>
                <br></br>
                <p className='description'>{getAbstract(modalData)}</p>
                <br></br>
                <a className='link-text' href={modalData?.url} target='_blank'>{t('link_to_news_source')}</a>
                <img className='open-in-new' src={openInNewTab} alt='open in new tab' />
                {isHelpDivAvail(modalData) ? (
                    <div className='support'>
                        <div className='title-with-line'>
                            <div className='title'>{t('how_to_help')}</div>
                            <div className='divider'></div>
                        </div>
                        {maybeGetHelpDiv(modalData)}
                    </div>
                ) : null}
            </Modal>

            {/* Attachment gallery: opened by clicking any attachment thumbnail.
                Shows images and videos for the row as a navigable carousel. */}
            <Modal
                isOpen={galleryOpen}
                onRequestClose={closeGallery}
                contentLabel="Attachment gallery"
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 1000,
                    },
                    content: {
                        position: 'fixed',
                        inset: 0,
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        overflow: 'hidden',
                    },
                }}
                className="gallery-modal"
            >
                <div className="gallery-root" onClick={closeGallery}>
                    <button
                        type="button"
                        className="gallery-close"
                        onClick={(e) => { e.stopPropagation(); closeGallery(); }}
                        aria-label="Close"
                    >
                        ×
                    </button>

                    {galleryUrls.length > 1 && (
                        <button
                            type="button"
                            className="gallery-nav gallery-prev"
                            onClick={(e) => { e.stopPropagation(); galleryPrev(); }}
                            aria-label="Previous"
                        >
                            ‹
                        </button>
                    )}

                    <div className="gallery-stage" onClick={(e) => e.stopPropagation()}>
                        {galleryUrls[galleryIndex] && (
                            isVideoUrl(galleryUrls[galleryIndex]) ? (
                                <video
                                    key={galleryUrls[galleryIndex]}
                                    src={galleryUrls[galleryIndex]}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="gallery-media"
                                />
                            ) : (
                                <img
                                    key={galleryUrls[galleryIndex]}
                                    src={galleryUrls[galleryIndex]}
                                    alt={`attachment ${galleryIndex + 1}`}
                                    className="gallery-media"
                                />
                            )
                        )}
                    </div>

                    {galleryUrls.length > 1 && (
                        <button
                            type="button"
                            className="gallery-nav gallery-next"
                            onClick={(e) => { e.stopPropagation(); galleryNext(); }}
                            aria-label="Next"
                        >
                            ›
                        </button>
                    )}

                    {galleryUrls.length > 1 && (
                        <div className="gallery-counter" onClick={(e) => e.stopPropagation()}>
                            {galleryIndex + 1} / {galleryUrls.length}
                        </div>
                    )}
                </div>
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
            {visibleLimit < props.data.length && searchTerm === "" ?
                (<div align='center'><Button className='btn-loadmore' size="sm" onClick={() => setVisibleLimit(visibleLimit + INCR_COUNT)}>{t('load_more')}.</Button></div>)
                : null}
        </div>
    )
}
export default IncidentList

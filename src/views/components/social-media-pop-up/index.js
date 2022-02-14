import React from 'react';
import ReactDOM from 'react-dom';
import { MdOutlineContentCopy } from 'react-icons/md';
import './Popup.css'
import { IconContext } from "react-icons";
import SocialMedia from '../social-media'
import { useTranslation } from 'react-i18next';

const Backdrop = ({setIsSharing}) => {
  return <div onClick={() => {setIsSharing(false)}} className="backdrop" />;
};

const ModalOverlay = (props) => {
    const { t } = useTranslation();
    return (
      <div className="modaltest">
        <p className='modal-title'>{t("social.share")}</p>
        <div className="modal-media">
          <SocialMedia size={47}  bgStyle={{fill: "#000000"}} iconFillColor={"white"} isShare={true}/>
        </div>
        <p>{t("social.copy_link")}</p>
        <div className='modal-link'>
          <input className='modal-input' type="text" name={"link_input"} defaultValue={'https://hatecrimetracker.1thing.org'}/>
          
          <IconContext.Provider value={{ size:"25", color: "yellow"}}>
            <button className="copy-button" onClick={() => {navigator.clipboard.writeText('https://hatecrimetracker.1thing.org')}}>
              <MdOutlineContentCopy/>
            </button>
          </IconContext.Provider>
        </div>
      </div>
    );
  };

  
const ModalPhoneOverlay = (props) => {
  const { t } = useTranslation();
  return (
    <div className="modalPhone">
      <p className='modal-title'>{t("social.follow_us")}</p>
      <div className="modal-media">
          <SocialMedia size={47}  bgStyle={{fill: "white"}} iconFillColor={"black"}/>
        </div>
    </div>
  );
};

const SocialMediaPopup = ({setIsSharing, deviceSize}) => {
  // console.log(deviceSize)
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop setIsSharing={setIsSharing}/>,
        document.getElementById('backdrop-root')
      )}
      {
        ReactDOM.createPortal( deviceSize > 786 ? <ModalOverlay /> : <ModalPhoneOverlay />, document.getElementById('overlay-root')) 
      }
    </React.Fragment>
  );
};

export default SocialMediaPopup;

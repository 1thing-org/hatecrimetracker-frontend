import React from 'react';
import ReactDOM from 'react-dom';
import { MdOutlineContentCopy } from 'react-icons/md';
import './Popup.css'
import { IconContext } from "react-icons";
import SocialMedia from '@components/social-media'

const Backdrop = ({setIsSharing}) => {
  return <div onClick={() => {setIsSharing(false)}} className="backdrop" />;
};

const ModalOverlay = (props) => {
    return (
      <div className="modaltest">
        <p className='modal-title'>Share hate crime tracker with your social Community</p>
        <div className="modal-media">
          <SocialMedia size={47}  bgStyle={{fill: "#000000"}} iconFillColor={"white"} isShare={true}/>
        </div>
        <p>or copy link</p>
        <div className='modal-link'>
          <input className='modal-input' type="text" name={"link_input"} value={'https://hatecrimetracker.1thing.org/home'}/>
          
          <IconContext.Provider value={{ size:"25", color: "yellow"}}>
            <button className="copy-button" onClick={() => {navigator.clipboard.writeText('https://hatecrimetracker.1thing.org/home')}}>
              <MdOutlineContentCopy/>
            </button>
          </IconContext.Provider>
        </div>
      </div>
    );
  };

  
const ModalPhoneOverlay = (props) => {
  return (
    <div className="modalPhone">
      <p className='modal-title'>Follow us on social media</p>
      <div className="modal-media">
          <SocialMedia size={47}  bgStyle={{fill: "white"}} iconFillColor={"black"}/>
        </div>
    </div>
  );
};

const SociaMediaPopup = ({setIsSharing, deviceSize}) => {
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

export default SociaMediaPopup;

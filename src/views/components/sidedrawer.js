import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "./sidedrawer.css";
import { MdOutlineCancel } from "react-icons/md";

const Backdrop = ({ setHamburgerOpen }) => {
  return (
    <div
      onClick={() => {
        setHamburgerOpen(false);
      }}
      className="backdrop"
    />
  );
};

const SidedrawerOverlay = ({ setHamburgerOpen }) => {
  return (
    <div className="sidedrawer">
      <ul className="sidedrawer_links">
        <li>
          <MdOutlineCancel
            className="cancel"
            size={30}
            onClick={() => setHamburgerOpen(false)}
          />
        </li>
        <li>
          <Link to="/dataexplorer">Data Explorer</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
};

const Sidedrawer = ({ setHamburgerOpen }) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop setHamburgerOpen={setHamburgerOpen} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <SidedrawerOverlay setHamburgerOpen={setHamburgerOpen} />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default Sidedrawer;

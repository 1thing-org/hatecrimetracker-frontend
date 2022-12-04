import React from "react";

export default function Hamburger() {
  return (
    <>
      <div className="hamburger">
        <div className="burger burger1" />
        <div className="burger burger2" />
        <div className="burger burger3" />
      </div>

      <style jsx='true'>
        {`
          .hamburger {
            width: 2.7rem;
            height: 1.7rem;
            display: flex;
            justify-content: space-between;
            flex-flow: column nowrap;
            z-index: 10;
            cursor: pointer;
            float: right;
          }

          .burger {
            display: flex;
            align-item: flex-end;
            width: 1.7rem;
            height: 0.25rem;
            border-radius: 10px;
            background-color: white;
            transform-origin: 1px;
            transition: all 0.3s linear;
          }
        `}
      </style>
    </>
  );
}

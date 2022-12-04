import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidedrawer from "./components/sidedrawer";
import { IonCol } from "@ionic/react";
import IncidentCountTable from "./components/IncidentCountTable";

import { useStateContext } from "../contexts/ContextProvider";

const DataExplorer = () => {
  const {
    deviceSize,
    changeDeviceSize,
    selectedState,
    setSelectedState,
    hamburgerOpen,
    setHamburgerOpen,
    incidentAggregated,
  } = useStateContext();

  useEffect(() => {
    const resizeW = () => changeDeviceSize(window.innerWidth);

    window.addEventListener("resize", resizeW); // Update the width on resize
    return () => window.removeEventListener("resize", resizeW);
  });

  const stateToggled = (state) => {
    // console.log("This is:" + this);
    const newState = state == selectedState ? null : state;
    // console.log("Toggle state:" + state + " selectedState:" + selectedState + " new state:" + newState)
    setSelectedState(newState);
  };

  return (
    <>
      {hamburgerOpen && (
        <Sidedrawer setHamburgerOpen={setHamburgerOpen} show={hamburgerOpen} />
      )}
      {deviceSize < 786 && <Navbar setHamburgerOpen={setHamburgerOpen} />}
      <IonCol xl="8" lg="6" md="12">
        <IncidentCountTable
          title={"Incident Count by State"}
          data={incidentAggregated}
          selectedState={selectedState}
          stateToggled={stateToggled}
        />
      </IonCol>
    </>
  );
};

export default DataExplorer;

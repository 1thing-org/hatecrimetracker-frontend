import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [deviceSize, changeDeviceSize] = useState(window.innerWidth);
  const [incidents, setIncidents] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [incidentAggregated, setIncidentAggregated] = useState([]);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  return (
    <StateContext.Provider
      value={{
        deviceSize,
        changeDeviceSize,
        incidents,
        setIncidents,
        selectedState,
        setSelectedState,
        incidentAggregated,
        setIncidentAggregated,
        hamburgerOpen,
        setHamburgerOpen,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

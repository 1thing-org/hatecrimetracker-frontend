import React, { useState, useEffect } from "react";
import IncidentList from "./components/IncidentList";
import { IonCard, IonCardContent, IonCol } from "@ionic/react";
import Navbar from "./components/Navbar";
import Sidedrawer from "./components/sidedrawer";

import { useStateContext } from "../contexts/ContextProvider";

const News = () => {
  const { incidents, hamburgerOpen, setHamburgerOpen } = useStateContext();
  const [deviceSize, changeDeviceSize] = useState(window.innerWidth);
  useEffect(() => {
    const resizeW = () => changeDeviceSize(window.innerWidth);

    window.addEventListener("resize", resizeW); // Update the width on resize
    return () => window.removeEventListener("resize", resizeW);
  });

  return (
    <>
      {hamburgerOpen && (
        <Sidedrawer setHamburgerOpen={setHamburgerOpen} show={hamburgerOpen} />
      )}
      {deviceSize < 786 && <Navbar setHamburgerOpen={setHamburgerOpen} />}
      <IonCol xl="4" lg="6" md="12">
        <IonCard
          color={"black"}
          style={
            deviceSize < 786 ? { paddingTop: "40px" } : { paddingTop: "0px" }
          }
        >
          {/* <CardHeader>
                <CardTitle>Hate Crime Incidents</CardTitle>
            </CardHeader> */}
          <IonCardContent>
            <h1 style={{ fontWeight: "bold" }}>News</h1>
            <IncidentList data={incidents} />
          </IonCardContent>
        </IonCard>
      </IonCol>
    </>
  );
};

export default News;

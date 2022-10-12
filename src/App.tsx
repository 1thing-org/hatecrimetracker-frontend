import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./views/Home";
import IncidentAdminPage from "./views/IncidentAdmin";
import "./assets/scss/style.scss";

// Components
import Sidedrawer from "./views/components/sidedrawer";
import Backdrop from "./views/components/backdrop";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
// import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import { setupIonicReact } from "@ionic/react";

setupIonicReact();

export default function App() {
  const [sideToggle, setSideToggle] = useState(false);

  return (
    <BrowserRouter>
      <Sidedrawer show={sideToggle} click={() => {}} />
      <Backdrop show={sideToggle} click={() => setSideToggle(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="admin" element={<IncidentAdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
